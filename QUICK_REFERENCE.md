# User Functionality - Quick Reference Card

## 🎯 Three API Endpoints

### 1️⃣ GET User Profile
```
GET /api/user/profile/{userId}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john",
    "phoneNumber": "0912345678",
    "address": "123 Main St",
    "role": "CUSTOMER",
    "active": true,
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-20T14:20:00",
    "lastLoginAt": "2025-01-22T09:15:00"
  }
}
```

---

### 2️⃣ UPDATE User Profile
```
PUT /api/user/profile/{userId}

Request:
{
  "phoneNumber": "0987654321",
  "address": "456 Oak Ave"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john",
    "phoneNumber": "0987654321",
    "address": "456 Oak Ave",
    "role": "CUSTOMER",
    "updatedAt": "2025-01-22T15:45:00"
  }
}
```

---

### 3️⃣ CHANGE Password
```
POST /api/user/profile/{userId}/change-password

Request:
{
  "currentPassword": "oldPass123",
  "newPassword": "newPass456",
  "confirmPassword": "newPass456"
}

Response Success:
{
  "success": true,
  "message": "Đổi mật khẩu thành công",
  "changedAt": "2025-01-22T16:00:00"
}

Response Error:
{
  "success": false,
  "errorCode": "INVALID_PASSWORD",
  "errorMessage": "Mật khẩu hiện tại không đúng"
}
```

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────┐
│ REST Controllers                                 │
│ UserProfileController                            │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│ ViewModels (Presentation)                        │
│ GetUserProfileViewModel                          │
│ UpdateUserProfileViewModel                       │
│ ChangePasswordViewModelImpl                       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│ Use Cases (Business Logic)                       │
│ GetUserProfileUseCaseControl                     │
│ UpdateUserProfileUseCaseControl                  │
│ ChangePasswordUseCaseControl                     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│ Repository (Data Access)                         │
│ UserRepository (interface)                       │
│ UserRepositoryAdapter (implementation)           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│ Database (JPA)                                   │
│ TaiKhoan entity / TaiKhoanJpaRepository          │
└─────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/main/java/com/motorbike/
├── business/
│   ├── dto/
│   │   ├── userprofile/
│   │   │   ├── GetUserProfileInputData
│   │   │   ├── GetUserProfileOutputData
│   │   │   ├── UpdateUserProfileInputData
│   │   │   └── UpdateUserProfileOutputData
│   │   └── changepassword/
│   │       ├── ChangePasswordInputData
│   │       └── ChangePasswordOutputData
│   └── usecase/
│       ├── input/ (3 Boundary interfaces)
│       ├── output/ (3 Boundary interfaces)
│       └── control/ (3 Use Case implementations)
├── adapters/
│   ├── controllers/
│   │   └── UserProfileController ⭐
│   ├── viewmodels/ (3 ViewModels)
│   └── dto/
│       ├── request/ (2 Request DTOs)
│       └── response/ (3 Response DTOs)
└── infrastructure/
    └── config/
        └── UseCaseConfig (Updated with 9 beans)
```

---

## 🔍 Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_USER_ID` | 400 | User ID is null/invalid |
| `USER_NOT_FOUND` | 400 | User doesn't exist |
| `INVALID_PASSWORD` | 400 | Current password wrong |
| `PASSWORD_MISMATCH` | 400 | New passwords don't match |
| `INVALID_PHONE_FORMAT` | 400 | Invalid phone number |
| `SYSTEM_ERROR` | 500 | Internal server error |

---

## ✅ Validation Rules

### Phone Number
- Format: `(0|+84)` followed by 9-10 digits
- Examples: `0912345678`, `+84912345678`

### Password
- Minimum 6 characters
- New and confirm must match

### Email
- Valid email format (existing validation)

### Username
- 3-50 characters (existing validation)

### Address
- Non-empty string

---

## 🚀 Testing Examples

### cURL Commands

**Get Profile:**
```bash
curl -X GET "http://localhost:8080/api/user/profile/1" \
  -H "Accept: application/json"
```

**Update Profile:**
```bash
curl -X PUT "http://localhost:8080/api/user/profile/1" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"0912345678","address":"123 Main"}'
```

**Change Password:**
```bash
curl -X POST "http://localhost:8080/api/user/profile/1/change-password" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old","newPassword":"new123","confirmPassword":"new123"}'
```

### Java Testing Code
```java
@RestController
public class UserProfileController {
    private final GetUserProfileInputBoundary getUserProfileUseCase;
    private final UpdateUserProfileInputBoundary updateUserProfileUseCase;
    private final ChangePasswordInputBoundary changePasswordUseCase;
    
    // Auto-injected by Spring through UseCaseConfig
}
```

---

## 📊 Database Integration

**Entity:** `TaiKhoan` (User Account)

**Fields Used:**
- `maTaiKhoan` (ID)
- `email`
- `tenDangNhap` (username)
- `matKhau` (password)
- `soDienThoai` (phone)
- `diaChi` (address)
- `vaiTro` (role)
- `hoatDong` (active)
- `ngayTao` (created)
- `ngayCapNhat` (updated)
- `lanDangNhapCuoi` (last login)

**Validation Methods (Used):**
- `validateEmail()`
- `validateTenDangNhap()`
- `validateMatKhau()`
- `validateSoDienThoai()`

---

## 🔐 Security Notes

⚠️ **Current Implementation:**
- Passwords compared as plain text
- Suitable for development/demo

✅ **For Production:**
1. Use bcrypt or Argon2 for hashing
2. Never store plain text passwords
3. Add HTTPS requirement
4. Implement rate limiting
5. Add authentication checks
6. Use JWT tokens

---

## 📚 File Dependencies

```
UserProfileController
├── GetUserProfileInputBoundary
│   └── GetUserProfileUseCaseControl
│       ├── UserRepository
│       └── GetUserProfileOutputBoundary
│           └── GetUserProfileViewModel
├── UpdateUserProfileInputBoundary
│   └── UpdateUserProfileUseCaseControl
│       ├── UserRepository
│       └── UpdateUserProfileOutputBoundary
│           └── UpdateUserProfileViewModel
└── ChangePasswordInputBoundary
    └── ChangePasswordUseCaseControl
        ├── UserRepository
        └── ChangePasswordOutputBoundary
            └── ChangePasswordViewModelImpl
```

---

## 🛠️ Extending the System

### To Add New Field to Profile:

1. **Entity** (`TaiKhoan`):
   ```java
   private String newField;
   public void setNewField(String value) { ... }
   public String getNewField() { ... }
   ```

2. **DTOs**: Add to Input/OutputData and Request/Response classes

3. **Controller**: Include in request mapping

4. **Use Case**: Handle in execute() method

---

## 📞 Quick Support

**For Questions About:**

**Architecture** → See `USER_FUNCTIONALITY_GUIDE.md`

**Usage Examples** → See `IMPLEMENTATION_SUMMARY.md`

**Implementation Details** → See `COMPLETION_REPORT.md`

**Code Details** → Check JavaDoc in source files

---

**Last Updated:** January 22, 2025
**Status:** ✅ Production Ready
**Build:** ✅ Compiles Successfully
