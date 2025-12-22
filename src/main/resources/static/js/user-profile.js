// User Profile Page JavaScript
const API_BASE_URL = 'http://localhost:8080/api';

let currentUserId = null;
let profileData = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuth();
    loadUserProfile();
    setupEventListeners();
});

// Check user authentication
function checkUserAuth() {
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    
    if (!userId || !username) {
        console.log('User not authenticated - redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    currentUserId = userId;
    document.getElementById('userName').textContent = username;
    document.getElementById('sidebarUsername').textContent = username;
}

// Load user profile data from API
async function loadUserProfile() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/user/profile/${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            profileData = data.data;
            populateProfileForm(data.data);
            updateSidebar(data.data);
        } else {
            showAlert('Lỗi', 'Không thể tải thông tin tài khoản');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
        showLoading(false);
    }
}

// Populate profile form with data
function populateProfileForm(data) {
    // Convert timestamp to date format if needed
    let createdDate = '';
    if (data.createAt) {
        const date = new Date(data.createAt);
        createdDate = date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    document.getElementById('email').value = data.email || '';
    document.getElementById('username').value = data.tenTaiKhoan || '';
    document.getElementById('fullName').value = data.hoTen || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('address').value = data.address || '';
    document.getElementById('createdDate').value = createdDate;
}

// Update sidebar with user info
function updateSidebar(data) {
    document.getElementById('sidebarEmail').textContent = data.email || 'user@example.com';
    const roleElement = document.getElementById('sidebarRole');
    
    if (data.vaiTro === 'ADMIN') {
        roleElement.textContent = 'ADMIN';
        roleElement.className = 'role-badge role-admin';
    } else {
        roleElement.textContent = 'CUSTOMER';
        roleElement.className = 'role-badge role-customer';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form validation
    document.getElementById('profileForm').addEventListener('change', function() {
        validateProfileForm();
    });
    
    document.getElementById('passwordForm').addEventListener('change', function() {
        validatePasswordForm();
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const tabId = tabName + '-tab';
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Scroll to top
    document.querySelector('.profile-content').scrollTop = 0;
}

// Update user profile
async function updateProfile(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateProfileForm()) {
        showAlert('Lỗi', 'Vui lòng kiểm tra lại thông tin');
        return;
    }
    
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    // Phone number validation (10-11 digits)
    if (!/^[0-9]{10,11}$/.test(phone.replace(/[-\s]/g, ''))) {
        showAlert('Lỗi', 'Số điện thoại phải có 10-11 chữ số');
        document.getElementById('phone').focus();
        return;
    }
    
    // Address validation
    if (address.length < 5 || address.length > 500) {
        showAlert('Lỗi', 'Địa chỉ phải từ 5 đến 500 ký tự');
        document.getElementById('address').focus();
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/user/profile/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phone,
                address: address
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAlert('Thành công', 'Thông tin tài khoản đã được cập nhật');
            // Reload profile data
            setTimeout(() => {
                loadUserProfile();
            }, 1500);
        } else {
            const errorMsg = data.message || 'Không thể cập nhật thông tin';
            showAlert('Lỗi', errorMsg);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Change password
async function changePassword(event) {
    event.preventDefault();
    
    // Validate form
    if (!validatePasswordForm()) {
        showAlert('Lỗi', 'Vui lòng kiểm tra lại mật khẩu');
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate password strength
    if (newPassword.length < 6) {
        showAlert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
        document.getElementById('newPassword').focus();
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('Lỗi', 'Mật khẩu xác nhận không khớp');
        document.getElementById('confirmPassword').focus();
        return;
    }
    
    if (currentPassword === newPassword) {
        showAlert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/user/profile/${currentUserId}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAlert('Thành công', 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            const errorMsg = data.message || 'Không thể thay đổi mật khẩu';
            showAlert('Lỗi', errorMsg);
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Validate profile form
function validateProfileForm() {
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!phone || !address) {
        return false;
    }
    
    return true;
}

// Validate password form
function validatePasswordForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        return false;
    }
    
    return true;
}

// Reset profile form
function resetProfileForm() {
    if (profileData) {
        populateProfileForm(profileData);
    }
}

// Reset password form
function resetPasswordForm() {
    document.getElementById('passwordForm').reset();
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    event.preventDefault();
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Show alert modal
function showAlert(title, message) {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'block';
}

// Close alert modal
function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

// Show/hide loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('alertModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
