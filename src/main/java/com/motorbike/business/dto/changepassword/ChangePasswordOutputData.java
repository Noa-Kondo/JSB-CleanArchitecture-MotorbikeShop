package com.motorbike.business.dto.changepassword;

import java.time.LocalDateTime;

public class ChangePasswordOutputData {
    private final boolean success;
    private final String errorCode;
    private final String message;
    private final LocalDateTime changedAt;

    private ChangePasswordOutputData(boolean success, String errorCode, String message, LocalDateTime changedAt) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.changedAt = changedAt;
    }

    public static ChangePasswordOutputData forSuccess(LocalDateTime changedAt) {
        return new ChangePasswordOutputData(true, null, null, changedAt);
    }

    public static ChangePasswordOutputData forError(String errorCode, String message) {
        return new ChangePasswordOutputData(false, errorCode, message, null);
    }

    public boolean isSuccess() { return success; }
    public String getErrorCode() { return errorCode; }
    public String getMessage() { return message; }
    public LocalDateTime getChangedAt() { return changedAt; }
}
