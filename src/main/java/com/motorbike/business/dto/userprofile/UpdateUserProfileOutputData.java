package com.motorbike.business.dto.userprofile;

import java.time.LocalDateTime;

public class UpdateUserProfileOutputData {
    private final boolean success;
    private final String errorCode;
    private final String message;

    private final Long id;
    private final String email;
    private final String username;
    private final String phoneNumber;
    private final String address;
    private final String role;
    private final LocalDateTime updatedAt;

    private UpdateUserProfileOutputData(boolean success, String errorCode, String message,
                                        Long id, String email, String username, String phoneNumber,
                                        String address, String role, LocalDateTime updatedAt) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.id = id;
        this.email = email;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
        this.updatedAt = updatedAt;
    }

    public static UpdateUserProfileOutputData forSuccess(Long id, String email, String username, String phoneNumber,
                                                         String address, String role, LocalDateTime updatedAt) {
        return new UpdateUserProfileOutputData(true, null, null, id, email, username, phoneNumber, address, role, updatedAt);
    }

    public static UpdateUserProfileOutputData forError(String errorCode, String message) {
        return new UpdateUserProfileOutputData(false, errorCode, message, null, null, null, null, null, null, null);
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
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
