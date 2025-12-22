package com.motorbike.business.dto.changepassword;

public class ChangePasswordInputData {
    private final Long userId;
    public final String currentPassword;
    public final String newPassword;
    public final String confirmPassword;

    private ChangePasswordInputData(Long userId, String currentPassword, String newPassword, String confirmPassword) {
        this.userId = userId;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    public static ChangePasswordInputData of(Long userId, String currentPassword, String newPassword, String confirmPassword) {
        return new ChangePasswordInputData(userId, currentPassword, newPassword, confirmPassword);
    }

    public Long getUserId() {
        return userId;
    }
}
