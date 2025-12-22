# User Functionality - Implementation Guide

## Overview

This document describes the comprehensive user management features implemented for the Motorbike Shop application. The implementation follows Clean Architecture principles with clear separation of concerns between business logic, adapters, and infrastructure layers.

## Features Implemented

### 1. Get User Profile
**Endpoint:** `GET /api/user/profile/{userId}`

Retrieves detailed user profile information including:
- Basic info (ID, email, username, phone, address)
- Role and account status
- Account creation, update, and last login timestamps

**Request Parameters:**
- `userId` (Path Parameter, Long): The ID of the user

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "phoneNumber": "0912345678",
    "address": "123 Main Street",
    "role": "CUSTOMER",
    "active": true,
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-20T14:20:00",
    "lastLoginAt": "2025-01-22T09:15:00"
  }
}
```

**Use Case:** `GetUserProfileUseCaseControl`
- Located in: `com.motorbike.business.usecase.control`
- Input Data: `GetUserProfileInputData`
- Output Data: `GetUserProfileOutputData`

---

### 2. Update User Profile
**Endpoint:** `PUT /api/user/profile/{userId}`

Allows users to update their profile information:
- Phone number (with validation)
- Address

**Request Parameters:**
- `userId` (Path Parameter, Long): The ID of the user
- Request Body: `UpdateUserProfileRequest`

**Request Body:**
```json
{
  "phoneNumber": "0987654321",
  "address": "456 Oak Avenue, District 5"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "phoneNumber": "0987654321",
    "address": "456 Oak Avenue, District 5",
    "role": "CUSTOMER",
    "updatedAt": "2025-01-22T15:45:00"
  }
}
```

**Validation:**
- Phone number must match Vietnamese phone format: `(0|+84)[0-9]{9,10}`
- Address can be any non-empty string
- Updates are automatically timestamped

**Use Case:** `UpdateUserProfileUseCaseControl`
- Located in: `com.motorbike.business.usecase.control`
- Input Data: `UpdateUserProfileInputData`
- Output Data: `UpdateUserProfileOutputData`

---

### 3. Change Password
**Endpoint:** `POST /api/user/profile/{userId}/change-password`

Securely change user password with validation:
- Current password verification
- New password confirmation matching
- Password strength validation

**Request Parameters:**
- `userId` (Path Parameter, Long): The ID of the user
- Request Body: `ChangePasswordRequest`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response - Success:**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công",
  "changedAt": "2025-01-22T16:00:00"
}
```

**Response - Error:**
```json
{
  "success": false,
  "errorCode": "INVALID_PASSWORD",
  "errorMessage": "Mật khẩu hiện tại không đúng"
}
```

**Validation Rules:**
- Current password must be correct
- New password and confirmation must match
- New password must be at least 6 characters
- Password update is timestamped

**Use Case:** `ChangePasswordUseCaseControl`
- Located in: `com.motorbike.business.usecase.control`
- Input Data: `ChangePasswordInputData`
- Output Data: `ChangePasswordOutputData`

---

## Architecture Components

### Business Layer (Domain)
**Entity:** `TaiKhoan` (User Account)
- Represents a user in the system
- Contains validation logic for email, username, phone number, password
- Supports role-based access (ADMIN, CUSTOMER)
- Tracks lifecycle events (creation, update, last login)

### Use Case Layer
| Component | Location | Purpose |
|-----------|----------|---------|
| `GetUserProfileInputBoundary` | business.usecase.input | Interface for profile retrieval |
| `UpdateUserProfileInputBoundary` | business.usecase.input | Interface for profile updates |
| `ChangePasswordInputBoundary` | business.usecase.input | Interface for password changes |
| `GetUserProfileUseCaseControl` | business.usecase.control | Implementation of profile retrieval |
| `UpdateUserProfileUseCaseControl` | business.usecase.control | Implementation of profile updates |
| `ChangePasswordUseCaseControl` | business.usecase.control | Implementation of password change |

### Adapter Layer
**Controllers:**
- `UserProfileController` - REST endpoints for all profile operations

**ViewModels:**
- `GetUserProfileViewModel` - Presenter for profile retrieval
- `UpdateUserProfileViewModel` - Presenter for profile updates
- `ChangePasswordViewModelImpl` - Presenter for password change

**DTOs:**
- Request: `UpdateUserProfileRequest`, `ChangePasswordRequest`
- Response: `GetUserProfileResponse`, `UpdateUserProfileResponse`, `ChangePasswordResponse`

### Infrastructure Layer
**Configuration:**
- `UseCaseConfig` - Spring Bean configuration for all use cases

**Database Layer:**
- `UserRepository` - Interface for user data access
- `UserRepositoryAdapter` - Implementation using JPA

---

## Error Handling

The implementation includes comprehensive error handling:

### Common Error Codes
- `INVALID_USER_ID` - User ID is null or invalid
- `USER_NOT_FOUND` - User does not exist in the system
- `INVALID_PASSWORD` - Current password is incorrect
- `PASSWORD_MISMATCH` - New passwords don't match
- `INVALID_PHONE_FORMAT` - Phone number format is invalid
- `SYSTEM_ERROR` - Internal server error

### Error Response Format
```json
{
  "success": false,
  "errorCode": "ERROR_CODE",
  "errorMessage": "Human readable error message"
}
```

---

## Data Models

### DTO Classes

**GetUserProfileResponse**
```java
{
  success: boolean,
  data: {
    id: Long,
    email: String,
    username: String,
    phoneNumber: String,
    address: String,
    role: String,
    active: boolean,
    createdAt: LocalDateTime,
    updatedAt: LocalDateTime,
    lastLoginAt: LocalDateTime
  },
  errorCode: String,
  errorMessage: String
}
```

**UpdateUserProfileRequest**
```java
{
  phoneNumber: String,
  address: String
}
```

**ChangePasswordRequest**
```java
{
  currentPassword: String,
  newPassword: String,
  confirmPassword: String
}
```

---

## Integration with Spring Boot

The user profile functionality is integrated with Spring Boot through:

1. **Dependency Injection** - All components are managed by Spring
2. **Request Scope** - ViewModels are scoped to request lifecycle
3. **REST Controllers** - Standard Spring REST annotations
4. **Bean Configuration** - Centralized in `UseCaseConfig`

### Configuration File
Location: `com.motorbike.infrastructure.config.UseCaseConfig`

The file contains bean definitions for:
- Use case controls
- Output boundaries
- ViewModels
- All dependencies (repositories, etc.)

---

## Testing Guidelines

When testing the user profile functionality:

1. **Unit Tests** - Test each use case in isolation
2. **Integration Tests** - Test with repository and database
3. **Controller Tests** - Test REST endpoints and HTTP status codes
4. **Validation Tests** - Test all validation rules

### Key Test Scenarios
- Valid profile retrieval
- Non-existent user error handling
- Profile update with valid data
- Profile update with invalid phone number
- Password change with correct current password
- Password change with incorrect current password
- Password mismatch error

---

## Validation Rules Summary

| Field | Rules |
|-------|-------|
| Email | Must be valid format (checked on entity) |
| Username | 3-50 characters (checked on entity) |
| Phone | Vietnamese format: (0/+84) + 9-10 digits |
| Password | Minimum 6 characters |
| Address | Non-empty string |
| Current Password | Must match stored password |
| New Password | Must match confirmation password |

---

## Future Enhancements

Potential improvements for future versions:
1. Password hashing (bcrypt/argon2) instead of plain text comparison
2. Email verification for account changes
3. Account lock after failed password attempts
4. Password history to prevent reuse
5. Two-factor authentication (2FA)
6. User preferences and settings management
7. Profile picture/avatar upload
8. Account deletion/deactivation
9. Login history tracking
10. Notification preferences

---

## Quick Start Example

### Get User Profile
```bash
curl -X GET http://localhost:8080/api/user/profile/1
```

### Update Profile
```bash
curl -X PUT http://localhost:8080/api/user/profile/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0912345678",
    "address": "123 Main Street"
  }'
```

### Change Password
```bash
curl -X POST http://localhost:8080/api/user/profile/1/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPass123",
    "newPassword": "newPass456",
    "confirmPassword": "newPass456"
  }'
```

---

## File Structure

```
src/main/java/com/motorbike/
├── business/
│   ├── dto/
│   │   ├── userprofile/
│   │   │   ├── GetUserProfileInputData.java
│   │   │   ├── GetUserProfileOutputData.java
│   │   │   ├── UpdateUserProfileInputData.java
│   │   │   └── UpdateUserProfileOutputData.java
│   │   └── changepassword/
│   │       ├── ChangePasswordInputData.java
│   │       └── ChangePasswordOutputData.java
│   └── usecase/
│       ├── input/
│       │   ├── GetUserProfileInputBoundary.java
│       │   ├── UpdateUserProfileInputBoundary.java
│       │   └── ChangePasswordInputBoundary.java
│       ├── output/
│       │   ├── GetUserProfileOutputBoundary.java
│       │   ├── UpdateUserProfileOutputBoundary.java
│       │   └── ChangePasswordOutputBoundary.java
│       └── control/
│           ├── GetUserProfileUseCaseControl.java
│           ├── UpdateUserProfileUseCaseControl.java
│           └── ChangePasswordUseCaseControl.java
├── adapters/
│   ├── controllers/
│   │   └── UserProfileController.java
│   ├── viewmodels/
│   │   ├── GetUserProfileViewModel.java
│   │   ├── UpdateUserProfileViewModel.java
│   │   └── ChangePasswordViewModelImpl.java
│   └── dto/
│       ├── request/
│       │   ├── UpdateUserProfileRequest.java
│       │   └── ChangePasswordRequest.java
│       └── response/
│           ├── GetUserProfileResponse.java
│           ├── UpdateUserProfileResponse.java
│           └── ChangePasswordResponse.java
└── infrastructure/
    └── config/
        └── UseCaseConfig.java
```

---

## Notes

- All timestamps are in LocalDateTime format
- Phone number validation follows Vietnamese standards
- Password validation is performed at the entity level
- All operations are logged and tracked with update timestamps
- The implementation maintains referential integrity with the existing user management system
