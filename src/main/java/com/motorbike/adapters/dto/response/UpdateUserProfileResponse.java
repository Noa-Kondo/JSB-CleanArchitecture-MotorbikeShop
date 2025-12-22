package com.motorbike.adapters.dto.response;

import java.time.LocalDateTime;

public class UpdateUserProfileResponse {
    private final boolean success;
    private final SuccessData data;
    private final String errorCode;
    private final String errorMessage;

    private UpdateUserProfileResponse(boolean success, SuccessData data, String errorCode, String errorMessage) {
        this.success = success;
        this.data = data;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public static UpdateUserProfileResponse success(SuccessData data) {
        return new UpdateUserProfileResponse(true, data, null, null);
    }

    public static UpdateUserProfileResponse error(String errorCode, String errorMessage) {
        return new UpdateUserProfileResponse(false, null, errorCode, errorMessage);
    }

    public boolean isSuccess() { return success; }
    public SuccessData getData() { return data; }
    public String getErrorCode() { return errorCode; }
    public String getErrorMessage() { return errorMessage; }

    public static class SuccessData {
        public final Long id;
        public final String email;
        public final String username;
        public final String phoneNumber;
        public final String address;
        public final String role;
        public final LocalDateTime updatedAt;

        public SuccessData(Long id, String email, String username, String phoneNumber,
                          String address, String role, LocalDateTime updatedAt) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.phoneNumber = phoneNumber;
            this.address = address;
            this.role = role;
            this.updatedAt = updatedAt;
        }
    }
}
