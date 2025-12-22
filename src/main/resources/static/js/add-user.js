document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createUserForm');
  const msg = document.getElementById('addMessage');

  function show(el, text, isError=false) {
    el.style.display = 'block';
    el.textContent = text;
    el.className = isError ? 'message error' : 'message';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    show(msg, 'Đang tạo người dùng...', false);

    const body = {
      email: document.getElementById('email').value,
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      phoneNumber: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      role: document.getElementById('role').value,
      active: document.getElementById('active').checked
    };

    try {
      const resp = await fetch('/api/admin/users?admin=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin'
      });
      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        show(msg, `Lỗi: ${data ? (data.message || JSON.stringify(data)) : resp.statusText}`, true);
        return;
      }
      if (!data || !data.success) {
        show(msg, `API trả lỗi: ${data ? (data.errorCode || data.message) : 'unknown'}`, true);
        return;
      }

      show(msg, 'Tạo người dùng thành công! Chuyển về danh sách...', false);
      setTimeout(() => window.location.href = 'users.html', 800);
    } catch (err) {
      console.error(err);
      show(msg, 'Lỗi khi tạo người dùng: ' + (err.message || err), true);
    }
  });
});