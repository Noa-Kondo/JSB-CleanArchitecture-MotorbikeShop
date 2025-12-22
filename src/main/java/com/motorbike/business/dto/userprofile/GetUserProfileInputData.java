package com.motorbike.business.dto.userprofile;

public class GetUserProfileInputData {
    private final Long userId;

    private GetUserProfileInputData(Long userId) {
        this.userId = userId;
    }

    public static GetUserProfileInputData of(Long userId) {
        return new GetUserProfileInputData(userId);
    }

    public Long getUserId() {
        return userId;
    }
}
