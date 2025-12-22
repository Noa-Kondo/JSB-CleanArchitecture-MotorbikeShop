package com.motorbike.business.dto.userprofile;

public class UpdateUserProfileInputData {
    private final Long userId;
    public final String phoneNumber;
    public final String address;

    private UpdateUserProfileInputData(Long userId, String phoneNumber, String address) {
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public static UpdateUserProfileInputData of(Long userId, String phoneNumber, String address) {
        return new UpdateUserProfileInputData(userId, phoneNumber, address);
    }

    public Long getUserId() {
        return userId;
    }
}
