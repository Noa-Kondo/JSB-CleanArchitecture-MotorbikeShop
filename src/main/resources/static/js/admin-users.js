document.addEventListener('DOMContentLoaded', () => {
  const loadBtn = document.getElementById('loadBtn');
  const message = document.getElementById('message');
  const tbody = document.querySelector('#usersTable tbody');
  const tokenInput = document.getElementById('token');
  const keywordInput = document.getElementById('keyword');

  const addForm = document.getElementById('addUserForm');
  const addMessage = document.getElementById('addMessage');
  const toggleAddFormBtn = document.getElementById('toggleAddFormBtn');

  const editForm = document.getElementById('editUserForm');
  const editMessage = document.getElementById('editMessage');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  function showMessage(el, text, isError = false) {
    el.textContent = text;
    el.className = isError ? 'message error' : 'message';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString();
    } catch (e) {
      return dateStr;
    }
  }

  async function callDeleteUser(id) {
    if (!confirm('Bạn có chắc muốn xóa người dùng có ID = ' + id + ' ?')) return;
    showMessage(message, 'Đang xóa...', false);

    const token = tokenInput.value && tokenInput.value.trim();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    try {
      const resp = await fetch('/api/admin/users/' + id + '?admin=true', {
        method: 'DELETE',
        headers,
        credentials: 'same-origin'
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        const txt = data ? (data.message || JSON.stringify(data)) : resp.statusText;
        showMessage(message, `Lỗi: ${resp.status} - ${txt}`, true);
        return;
      }

      if (!data || !data.success) {
        showMessage(message, `Xóa thất bại: ${data ? (data.errorCode || data.message) : 'unknown'}`, true);
        return;
      }

      showMessage(message, 'Xóa người dùng thành công', false);
      loadUsers();
    } catch (err) {
      console.error(err);
      showMessage(message, 'Lỗi khi gọi API: ' + (err.message || err), true);
    }
  }

  function openEditForm(user) {
    // show form and prefill
    document.getElementById('editId').value = user.id;
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editPhone').value = user.phoneNumber || '';
    document.getElementById('editAddress').value = user.address || '';
    document.getElementById('editRole').value = user.role || '';
    document.getElementById('editActive').checked = !!user.active;

    editForm.style.display = 'block';
    editMessage.textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitEditForm(e) {
    e.preventDefault();
    showMessage(editMessage, 'Đang cập nhật...', false);

    const id = document.getElementById('editId').value;
    const body = {
      email: document.getElementById('editEmail').value,
      username: document.getElementById('editUsername').value,
      password: document.getElementById('editPassword').value || null,
      phoneNumber: document.getElementById('editPhone').value,
      address: document.getElementById('editAddress').value,
      role: document.getElementById('editRole').value || null,
      active: document.getElementById('editActive').checked
    };

    const token = tokenInput.value && tokenInput.value.trim();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    try {
      const resp = await fetch('/api/admin/users/' + id + '?admin=true', {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
        credentials: 'same-origin'
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        const txt = data ? (data.message || JSON.stringify(data)) : resp.statusText;
        showMessage(editMessage, `Lỗi: ${resp.status} - ${txt}`, true);
        return;
      }

      if (!data || !data.success) {
        showMessage(editMessage, `Cập nhật thất bại: ${data ? (data.errorCode || data.message) : 'unknown'}`, true);
        return;
      }

      showMessage(editMessage, 'Cập nhật thành công', false);
      editForm.style.display = 'none';
      editForm.reset();
      loadUsers();
    } catch (err) {
      console.error(err);
      showMessage(editMessage, 'Lỗi khi cập nhật người dùng: ' + (err.message || err), true);
    }
  }

  async function loadUsers() {
    showMessage(message, 'Đang tải...', false);
    tbody.innerHTML = '';

    const keyword = keywordInput.value && keywordInput.value.trim();
    const params = new URLSearchParams();
    params.set('admin', 'true');
    if (keyword) params.set('keyword', keyword);

    const url = '/api/admin/users?' + params.toString();
    const headers = { 'Content-Type': 'application/json' };
    const token = tokenInput.value && tokenInput.value.trim();
    if (token) headers['Authorization'] = token;

    try {
      const resp = await fetch(url, { method: 'GET', headers, credentials: 'same-origin' });
      if (!resp.ok) {
        const text = await resp.text().catch(() => resp.statusText);
        showMessage(message, `Lỗi: ${resp.status} - ${text}`, true);
        return;
      }

      const data = await resp.json();
      if (!data.success) {
        showMessage(message, `API trả lỗi: ${data.errorCode || ''} ${data.message || ''}`, true);
        return;
      }

      const users = data.users || [];
      if (users.length === 0) {
        showMessage(message, 'Không có người dùng nào để hiển thị.', false);
        return;
      }

      for (const u of users) {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.textContent = u.id ?? '';
        tr.appendChild(idTd);

        const emailTd = document.createElement('td');
        emailTd.textContent = u.email ?? '';
        tr.appendChild(emailTd);

        const usernameTd = document.createElement('td');
        usernameTd.textContent = u.username ?? '';
        tr.appendChild(usernameTd);

        const roleTd = document.createElement('td');
        const roleSpan = document.createElement('span');
        roleSpan.className = 'role-badge ' + (u.role === 'ADMIN' ? 'role-admin' : 'role-customer');
        roleSpan.textContent = u.role ?? '';
        roleTd.appendChild(roleSpan);
        tr.appendChild(roleTd);

        const activeTd = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = 'status-badge ' + (u.active === true ? 'status-active' : 'status-inactive');
        statusSpan.textContent = (u.active === true) ? 'Hoạt động' : 'Bị khóa';
        activeTd.appendChild(statusSpan);
        tr.appendChild(activeTd);

        const createdTd = document.createElement('td');
        createdTd.textContent = formatDate(u.createdAt);
        tr.appendChild(createdTd);

        const updatedTd = document.createElement('td');
        updatedTd.textContent = formatDate(u.updatedAt);
        tr.appendChild(updatedTd);

        const lastLoginTd = document.createElement('td');
        lastLoginTd.textContent = formatDate(u.lastLogin);
        tr.appendChild(lastLoginTd);

        // Action cell: Edit + Delete + Toggle Active + Change Role + Reset Password
        const actionTd = document.createElement('td');
        actionTd.className = 'action-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon btn-edit';
        editBtn.title = 'Sửa';
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => {
          const userForEdit = {
            id: u.id,
            email: u.email,
            username: u.username,
            phoneNumber: u.phoneNumber || '',
            address: u.address || '',
            role: u.role || '',
            active: u.active
          };
          openEditForm(userForEdit);
          document.getElementById('editSection').style.display = 'block';
        });
        actionTd.appendChild(editBtn);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon btn-delete';
        delBtn.title = 'Xóa';
        delBtn.textContent = '🗑️';
        delBtn.addEventListener('click', () => callDeleteUser(u.id));
        actionTd.appendChild(delBtn);

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-icon btn-toggle';
        toggleBtn.title = u.active ? 'Khóa' : 'Mở khóa';
        toggleBtn.textContent = u.active ? '🔒' : '🔓';
        toggleBtn.addEventListener('click', () => toggleActiveUser(u));
        actionTd.appendChild(toggleBtn);

        const roleBtn = document.createElement('button');
        roleBtn.className = 'btn-icon btn-role';
        roleBtn.title = 'Chuyển vai trò';
        roleBtn.textContent = '🛡️';
        roleBtn.addEventListener('click', () => changeRole(u));
        actionTd.appendChild(roleBtn);

        tr.appendChild(actionTd);

        tbody.appendChild(tr);
      }

      showMessage(message, `Đã tải ${users.length} người dùng.`, false);
    } catch (err) {
      console.error(err);
      showMessage(message, 'Lỗi khi gọi API: ' + (err.message || err), true);
    }
  }

  loadBtn.addEventListener('click', loadUsers);
  if (toggleAddFormBtn && addForm) {
    toggleAddFormBtn.addEventListener('click', () => {
      const isHidden = addForm.style.display === 'none' || getComputedStyle(addForm).display === 'none';
      addForm.style.display = isHidden ? 'block' : 'none';
    });
  }

  // Debounce: tự động tìm 400ms sau khi gõ
  let debounceTimer = null;
  keywordInput.addEventListener('input', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      loadUsers();
    }, 400);
  });

  // Handle add user form (optional presence)
  if (addForm) addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage(addMessage, 'Đang thêm người dùng...', false);

    const body = {
      email: document.getElementById('addEmail').value,
      username: document.getElementById('addUsername').value,
      password: document.getElementById('addPassword').value,
      phoneNumber: document.getElementById('addPhone').value,
      address: document.getElementById('addAddress').value,
      role: document.getElementById('addRole').value || null,
      active: document.getElementById('addActive').checked
    };

    const token = tokenInput.value && tokenInput.value.trim();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    try {
      const resp = await fetch('/api/admin/users?admin=true', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'same-origin'
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        const txt = data ? (data.message || JSON.stringify(data)) : resp.statusText;
        showMessage(addMessage, `Lỗi: ${resp.status} - ${txt}`, true);
        return;
      }

      if (!data || !data.success) {
        showMessage(addMessage, `API trả lỗi: ${data ? (data.errorCode || data.message) : 'unknown'}`, true);
        return;
      }

      showMessage(addMessage, 'Thêm người dùng thành công', false);
      addForm.reset();
      loadUsers();
    } catch (err) {
      console.error(err);
      showMessage(addMessage, 'Lỗi khi thêm người dùng: ' + (err.message || err), true);
    }
  });

  // Handle edit form
  editForm.addEventListener('submit', submitEditForm);
  cancelEditBtn.addEventListener('click', () => {
    editForm.style.display = 'none';
    editForm.reset();
    editMessage.textContent = '';
    const editSection = document.getElementById('editSection');
    if (editSection) editSection.style.display = 'none';
  });

  // Tự động tải khi mở page
  loadUsers();

  // Extra actions
  async function toggleActiveUser(user) {
    const body = {
      email: user.email,
      username: user.username,
      password: null,
      phoneNumber: user.phoneNumber || null,
      address: user.address || null,
      role: user.role,
      active: !user.active
    };
    const resp = await fetch('/api/admin/users/' + user.id + '?admin=true', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin'
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok || !data || !data.success) {
      showMessage(message, `Lỗi cập nhật trạng thái: ${data ? (data.errorCode || data.message) : resp.statusText}`, true);
      return;
    }
    showMessage(message, 'Cập nhật trạng thái thành công', false);
    loadUsers();
  }

  async function changeRole(user) {
    const newRole = (user.role === 'ADMIN') ? 'CUSTOMER' : 'ADMIN';
    const body = {
      email: user.email,
      username: user.username,
      password: null,
      phoneNumber: user.phoneNumber || null,
      address: user.address || null,
      role: newRole,
      active: user.active
    };
    const resp = await fetch('/api/admin/users/' + user.id + '?admin=true', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin'
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok || !data || !data.success) {
      showMessage(message, `Lỗi đổi vai trò: ${data ? (data.errorCode || data.message) : resp.statusText}`, true);
      return;
    }
    showMessage(message, 'Đã đổi vai trò người dùng', false);
    loadUsers();
  }
});