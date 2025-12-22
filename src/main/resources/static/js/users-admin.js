// Users Admin Page JavaScript
const API_BASE_URL = 'http://localhost:8080/api';

let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const itemsPerPage = 10;
let userToDelete = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    updateAdminGreeting();
    loadUsers();
    setupEventListeners();
});

// Check if user has admin role
function checkAdminAccess() {
    const role = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    const normalizedRole = role ? String(role).trim().toUpperCase() : '';
    const isAdmin = normalizedRole.includes('ADMIN') || 
                    normalizedRole.includes('QUẢN TRỊ') ||
                    normalizedRole.includes('ADMIN_ROLE') ||
                    normalizedRole.includes('ROLE_ADMIN');

    if (!isAdmin) {
        document.body.innerHTML = `
            <div style="padding:80px;text-align:center;">
                <h1>Truy cập bị từ chối</h1>
                <p>Bạn không có quyền truy cập trang này.</p>
                <button onclick="logout()" class="btn-primary">Quay lại</button>
            </div>
        `;
        return;
    }
}

// Update admin greeting
function updateAdminGreeting() {
    const username = sessionStorage.getItem('username') || 'Admin';
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = username;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function() {
        filterUsers();
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        const userModal = document.getElementById('userModal');
        const deleteModal = document.getElementById('deleteModal');
        const alertModal = document.getElementById('alertModal');
        
        if (event.target === userModal) {
            closeUserModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
        if (event.target === alertModal) {
            closeAlert();
        }
    }
}

// Load users from API
async function loadUsers() {
    try {
        showLoading(true);
        
        // Fetch all users
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            allUsers = data.data;
            filteredUsers = [...allUsers];
            renderUsers();
        } else if (Array.isArray(data)) {
            allUsers = data;
            filteredUsers = [...allUsers];
            renderUsers();
        } else {
            showAlert('Lỗi', 'Không thể tải danh sách người dùng');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Filter users based on search and role
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredUsers = allUsers.filter(user => {
        const matchSearch = !searchTerm || 
                           (user.email && user.email.toLowerCase().includes(searchTerm)) ||
                           (user.hoTen && user.hoTen.toLowerCase().includes(searchTerm)) ||
                           (user.tenTaiKhoan && user.tenTaiKhoan.toLowerCase().includes(searchTerm));
        
        const matchRole = !roleFilter || (user.vaiTro && user.vaiTro.includes(roleFilter));
        
        const userStatus = (user.trangThai && user.trangThai.toUpperCase()) || 'HOẠT ĐỘNG';
        const matchStatus = !statusFilter || userStatus.includes(statusFilter.toUpperCase());
        
        return matchSearch && matchRole && matchStatus;
    });
    
    currentPage = 1;
    renderUsers();
}

// Render users in table
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    📭 Không tìm thấy người dùng nào
                </td>
            </tr>
        `;
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToShow = filteredUsers.slice(startIndex, endIndex);
    
    // Render table rows
    tbody.innerHTML = usersToShow.map(user => `
        <tr>
            <td>${user.maTaiKhoan || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.tenTaiKhoan || 'N/A'}</td>
            <td>${user.hoTen || 'N/A'}</td>
            <td>
                <span class="role-badge ${user.vaiTro === 'ADMIN' ? 'role-admin' : 'role-customer'}">
                    ${user.vaiTro || 'N/A'}
                </span>
            </td>
            <td>
                <span class="status-badge ${(user.trangThai || '').toUpperCase().includes('HOẠT') ? 'status-active' : 'status-inactive'}">
                    ${user.trangThai || 'HOẠT ĐỘNG'}
                </span>
            </td>
            <td>${formatDate(user.createAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${user.maTaiKhoan})" title="Chỉnh sửa">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteUser(${user.maTaiKhoan})" title="Xóa">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update pagination
    if (totalPages > 1) {
        document.getElementById('paginationContainer').style.display = 'flex';
        document.getElementById('pageInfo').textContent = `Trang ${currentPage} / ${totalPages}`;
    } else {
        document.getElementById('paginationContainer').style.display = 'none';
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Open add user modal
function openAddUserModal() {
    document.getElementById('modalTitle').textContent = 'Thêm người dùng';
    document.getElementById('userForm').reset();
    document.getElementById('password').required = true;
    document.getElementById('userModal').style.display = 'block';
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// Edit user
async function editUser(userId) {
    const user = allUsers.find(u => u.maTaiKhoan === userId);
    if (!user) return;
    
    document.getElementById('modalTitle').textContent = 'Chỉnh sửa người dùng';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('username').value = user.tenTaiKhoan || '';
    document.getElementById('password').value = ''; // Don't show password
    document.getElementById('password').required = false;
    document.getElementById('fullName').value = user.hoTen || '';
    document.getElementById('userRole').value = user.vaiTro || 'CUSTOMER';
    
    // Store user ID for update
    document.getElementById('userForm').dataset.userId = userId;
    
    document.getElementById('userModal').style.display = 'block';
}

// Save user (create or update)
async function saveUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('userEmail').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const role = document.getElementById('userRole').value;
    const userId = document.getElementById('userForm').dataset.userId;
    
    // Validate
    if (!email || !username || !fullName || !role) {
        showAlert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
        return;
    }
    
    if (userId && !password) {
        // Update - password is optional
    } else if (!userId && !password) {
        // Create - password is required
        showAlert('Lỗi', 'Vui lòng nhập mật khẩu');
        return;
    } else if (password && password.length < 6) {
        showAlert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }
    
    try {
        showLoading(true);
        
        const payload = {
            email,
            tenTaiKhoan: username,
            hoTen: fullName,
            vaiTro: role
        };
        
        if (password) {
            payload.matKhau = password;
        }
        
        const method = userId ? 'PUT' : 'POST';
        const url = userId ? 
            `${API_BASE_URL}/admin/users/${userId}` : 
            `${API_BASE_URL}/admin/users`;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAlert('Thành công', userId ? 'Cập nhật người dùng thành công' : 'Thêm người dùng thành công');
            closeUserModal();
            setTimeout(() => {
                loadUsers();
            }, 1500);
        } else {
            const errorMsg = data.message || 'Không thể lưu người dùng';
            showAlert('Lỗi', errorMsg);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Delete user
function deleteUser(userId) {
    userToDelete = userId;
    document.getElementById('deleteModal').style.display = 'block';
}

// Confirm delete
async function confirmDelete() {
    if (!userToDelete) return;
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/admin/users/${userToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAlert('Thành công', 'Người dùng đã được xóa');
            closeDeleteModal();
            setTimeout(() => {
                loadUsers();
            }, 1500);
        } else {
            const errorMsg = data.message || 'Không thể xóa người dùng';
            showAlert('Lỗi', errorMsg);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    userToDelete = null;
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderUsers();
        window.scrollTo(0, 0);
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderUsers();
        window.scrollTo(0, 0);
    }
}

// Show alert
function showAlert(title, message) {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'block';
}

// Close alert
function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

// Show/hide loading
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}
