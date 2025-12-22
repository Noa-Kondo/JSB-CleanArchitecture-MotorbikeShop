document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api';
    let allUsers = [];
    let deleteTargetId = null;

    // DOM Elements
    const loadBtn = document.getElementById('loadBtn');
    const messageDiv = document.getElementById('message');
    const addUserForm = document.getElementById('addUserForm');
    const addMessage = document.getElementById('addMessage');
    const toggleAddFormBtn = document.getElementById('toggleAddFormBtn');
    const searchKeywordInput = document.getElementById('searchKeyword');
    const usersTableBody = document.getElementById('usersTableBody');
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const editMessage = document.getElementById('editMessage');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Helper Functions
    function showMessage(element, text, isError = false) {
        element.textContent = text;
        element.className = isError ? 'message error' : 'message success';
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleString('vi-VN');
        } catch (e) {
            return dateStr;
        }
    }

    function getAdminName() {
        return sessionStorage.getItem('username') || localStorage.getItem('username') || 'Admin';
    }

    // Update Admin Name
    document.getElementById('adminName').textContent = getAdminName();

    // Load Users Function
    async function loadUsers() {
        try {
            showMessage(messageDiv, 'Đang tải dữ liệu...', false);
            usersTableBody.innerHTML = '';

            const keyword = searchKeywordInput.value?.trim() || '';
            const params = new URLSearchParams();
            params.set('admin', 'true');
            if (keyword) params.set('keyword', keyword);

            const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                showMessage(messageDiv, `Lỗi: ${data.message || 'Không thể tải dữ liệu'}`, true);
                return;
            }

            allUsers = data.users || [];

            if (allUsers.length === 0) {
                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                            Không có người dùng nào
                        </td>
                    </tr>
                `;
                updateStatistics([]);
                showMessage(messageDiv, 'Không có dữ liệu', false);
                return;
            }

            // Render Users Table
            allUsers.forEach(user => {
                const tr = document.createElement('tr');
                
                const statusBadge = user.active ? 
                    '<span class="badge badge-success">Hoạt động</span>' : 
                    '<span class="badge badge-danger">Bị khóa</span>';
                
                const roleBadge = user.role === 'ADMIN' ?
                    '<span class="badge badge-admin">ADMIN</span>' :
                    '<span class="badge badge-customer">CUSTOMER</span>';

                tr.innerHTML = `
                    <td>${user.id || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.username || 'N/A'}</td>
                    <td>${roleBadge}</td>
                    <td>${statusBadge}</td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td>${formatDate(user.updatedAt)}</td>
                    <td>${formatDate(user.lastLogin) || 'Chưa đăng nhập'}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editUser(${user.id})">✏️ Sửa</button>
                        <button class="btn-action btn-delete" onclick="deleteUser(${user.id}, '${user.email}')">🗑️ Xóa</button>
                    </td>
                `;
                usersTableBody.appendChild(tr);
            });

            updateStatistics(allUsers);
            showMessage(messageDiv, `Đã tải ${allUsers.length} người dùng`, false);

        } catch (error) {
            console.error('Load users error:', error);
            showMessage(messageDiv, `Lỗi khi tải dữ liệu: ${error.message}`, true);
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: #c00;">
                        Lỗi tải dữ liệu
                    </td>
                </tr>
            `;
        }
    }

    // Update Statistics
    function updateStatistics(users) {
        const totalUsers = users.length;
        const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
        const totalCustomers = users.filter(u => u.role === 'CUSTOMER').length;
        const activeUsers = users.filter(u => u.active).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalAdmins').textContent = totalAdmins;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('activeUsers').textContent = activeUsers;
    }

    // Add User Form Handler
    toggleAddFormBtn.addEventListener('click', () => {
        const form = document.getElementById('addUserForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            showMessage(addMessage, 'Đang thêm người dùng...', false);

            const body = {
                email: document.getElementById('addEmail').value,
                username: document.getElementById('addUsername').value,
                password: document.getElementById('addPassword').value,
                phoneNumber: document.getElementById('addPhone').value,
                address: document.getElementById('addAddress').value,
                role: document.getElementById('addRole').value,
                active: document.getElementById('addActive').checked
            };

            const response = await fetch(`${API_BASE_URL}/admin/users?admin=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(addMessage, `Lỗi: ${data.message || 'Không thể thêm người dùng'}`, true);
                return;
            }

            if (!data.success) {
                showMessage(addMessage, `Thêm thất bại: ${data.errorCode || data.message}`, true);
                return;
            }

            showMessage(addMessage, 'Thêm người dùng thành công!', false);
            addUserForm.reset();
            document.getElementById('addUserForm').style.display = 'none';
            loadUsers();

        } catch (error) {
            console.error('Add user error:', error);
            showMessage(addMessage, `Lỗi: ${error.message}`, true);
        }
    });

    // Edit User Function
    window.editUser = function(userId) {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return;

        document.getElementById('editId').value = user.id;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editPassword').value = '';
        document.getElementById('editPhone').value = user.phoneNumber || '';
        document.getElementById('editAddress').value = user.address || '';
        document.getElementById('editRole').value = user.role;
        document.getElementById('editActive').checked = user.active;

        editUserModal.style.display = 'block';
        editMessage.textContent = '';
    };

    window.closeEditModal = function() {
        editUserModal.style.display = 'none';
        editUserForm.reset();
        editMessage.textContent = '';
    };

    // Edit Form Handler
    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            showMessage(editMessage, 'Đang cập nhật...', false);

            const userId = document.getElementById('editId').value;
            const body = {
                email: document.getElementById('editEmail').value,
                username: document.getElementById('editUsername').value,
                password: document.getElementById('editPassword').value || null,
                phoneNumber: document.getElementById('editPhone').value,
                address: document.getElementById('editAddress').value,
                role: document.getElementById('editRole').value,
                active: document.getElementById('editActive').checked
            };

            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}?admin=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(editMessage, `Lỗi: ${data.message || 'Không thể cập nhật'}`, true);
                return;
            }

            if (!data.success) {
                showMessage(editMessage, `Cập nhật thất bại: ${data.errorCode || data.message}`, true);
                return;
            }

            showMessage(editMessage, 'Cập nhật thành công!', false);
            closeEditModal();
            loadUsers();

        } catch (error) {
            console.error('Edit user error:', error);
            showMessage(editMessage, `Lỗi: ${error.message}`, true);
        }
    });

    // Delete User Function
    window.deleteUser = function(userId, email) {
        deleteTargetId = userId;
        document.getElementById('deleteConfirmText').textContent = 
            `Bạn có chắc chắn muốn xóa người dùng "${email}"? Hành động này không thể hoàn tác.`;
        deleteConfirmModal.style.display = 'block';
    };

    window.closeDeleteModal = function() {
        deleteConfirmModal.style.display = 'none';
        deleteTargetId = null;
    };

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!deleteTargetId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${deleteTargetId}?admin=true`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(messageDiv, `Lỗi: ${data.message || 'Không thể xóa'}`, true);
                return;
            }

            if (!data.success) {
                showMessage(messageDiv, `Xóa thất bại: ${data.errorCode || data.message}`, true);
                return;
            }

            showMessage(messageDiv, 'Xóa người dùng thành công!', false);
            closeDeleteModal();
            loadUsers();

        } catch (error) {
            console.error('Delete user error:', error);
            showMessage(messageDiv, `Lỗi: ${error.message}`, true);
        }
    });

    // Event Listeners
    loadBtn.addEventListener('click', loadUsers);
    searchKeywordInput.addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            loadUsers();
        }, 400);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editUserModal) closeEditModal();
        if (e.target === deleteConfirmModal) closeDeleteModal();
    });

    // Logout Function
    window.logout = function() {
        sessionStorage.clear();
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    };

    // Initial Load
    loadUsers();
});
