package com.motorbike.business.dto.userprofile;

import java.time.LocalDateTime;

public class GetUserProfileOutputData {
    private final boolean success;
    private final String errorCode;
    private final String message;

    private final Long id;
    private final String email;
    private final String username;
    private final String phoneNumber;
    private final String address;
    private final String role;
    private final boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final LocalDateTime lastLoginAt;

    private GetUserProfileOutputData(boolean success, String errorCode, String message,
                                     Long id, String email, String username, String phoneNumber,
                                     String address, String role, boolean active,
                                     LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime lastLoginAt) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.id = id;
        this.email = email;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
    }

    public static GetUserProfileOutputData forSuccess(Long id, String email, String username, String phoneNumber,
                                                       String address, String role, boolean active,
                                                       LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime lastLoginAt) {
        return new GetUserProfileOutputData(true, null, null, id, email, username, phoneNumber, address, role, active, createdAt, updatedAt, lastLoginAt);
    }

    public static GetUserProfileOutputData forError(String errorCode, String message) {
        return new GetUserProfileOutputData(false, errorCode, message, null, null, null, null, null, null, false, null, null, null);
    }

    public boolean isSuccess() { return success; }
    public String getErrorCode() { return errorCode; }
    public String getMessage() { return message; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
}
