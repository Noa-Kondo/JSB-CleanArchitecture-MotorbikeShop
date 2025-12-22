package com.motorbike.adapters.dto.response;

import java.time.LocalDateTime;

public class ChangePasswordResponse {
    private final boolean success;
    private final String message;
    private final LocalDateTime changedAt;
    private final String errorCode;
    private final String errorMessage;

    private ChangePasswordResponse(boolean success, String message, LocalDateTime changedAt, String errorCode, String errorMessage) {
        this.success = success;
        this.message = message;
        this.changedAt = changedAt;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public static ChangePasswordResponse success(String message, LocalDateTime changedAt) {
        return new ChangePasswordResponse(true, message, changedAt, null, null);
    }

    public static ChangePasswordResponse error(String errorCode, String errorMessage) {
        return new ChangePasswordResponse(false, null, null, errorCode, errorMessage);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getErrorCode() { return errorCode; }
    public String getErrorMessage() { return errorMessage; }
}
