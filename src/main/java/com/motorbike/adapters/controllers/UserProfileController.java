package com.motorbike.adapters.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motorbike.adapters.dto.request.ChangePasswordRequest;
import com.motorbike.adapters.dto.request.UpdateUserProfileRequest;
import com.motorbike.adapters.dto.response.ChangePasswordResponse;
import com.motorbike.adapters.dto.response.GetUserProfileResponse;
import com.motorbike.adapters.dto.response.UpdateUserProfileResponse;
import com.motorbike.adapters.viewmodels.ChangePasswordViewModelImpl;
import com.motorbike.adapters.viewmodels.GetUserProfileViewModel;
import com.motorbike.adapters.viewmodels.UpdateUserProfileViewModel;
import com.motorbike.business.dto.changepassword.ChangePasswordInputData;
import com.motorbike.business.dto.userprofile.GetUserProfileInputData;
import com.motorbike.business.dto.userprofile.UpdateUserProfileInputData;
import com.motorbike.business.usecase.input.ChangePasswordInputBoundary;
import com.motorbike.business.usecase.input.GetUserProfileInputBoundary;
import com.motorbike.business.usecase.input.UpdateUserProfileInputBoundary;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final GetUserProfileInputBoundary getUserProfileInputBoundary;
    private final GetUserProfileViewModel getUserProfileViewModel;

    private final UpdateUserProfileInputBoundary updateUserProfileInputBoundary;
    private final UpdateUserProfileViewModel updateUserProfileViewModel;

    private final ChangePasswordInputBoundary changePasswordInputBoundary;
    private final ChangePasswordViewModelImpl changePasswordViewModel;

    @Autowired
    public UserProfileController(
            GetUserProfileInputBoundary getUserProfileInputBoundary,
            GetUserProfileViewModel getUserProfileViewModel,
            UpdateUserProfileInputBoundary updateUserProfileInputBoundary,
            UpdateUserProfileViewModel updateUserProfileViewModel,
            ChangePasswordInputBoundary changePasswordInputBoundary,
            ChangePasswordViewModelImpl changePasswordViewModel) {
        this.getUserProfileInputBoundary = getUserProfileInputBoundary;
        this.getUserProfileViewModel = getUserProfileViewModel;
        this.updateUserProfileInputBoundary = updateUserProfileInputBoundary;
        this.updateUserProfileViewModel = updateUserProfileViewModel;
        this.changePasswordInputBoundary = changePasswordInputBoundary;
        this.changePasswordViewModel = changePasswordViewModel;
    }

    /**
     * Get user profile information
     * @param userId User ID
     * @return User profile data
     */
    @GetMapping("/{userId}")
    public ResponseEntity<GetUserProfileResponse> getUserProfile(@PathVariable Long userId) {
        GetUserProfileInputData input = GetUserProfileInputData.of(userId);
        getUserProfileInputBoundary.execute(input);
        return getUserProfileViewModel.getResponse();
    }

    /**
     * Update user profile information (phone number and address)
     * @param userId User ID
     * @param request Update profile request
     * @return Updated user profile data
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UpdateUserProfileResponse> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserProfileRequest request) {
        UpdateUserProfileInputData input = UpdateUserProfileInputData.of(
            userId,
            request.getPhoneNumber(),
            request.getAddress()
        );
        updateUserProfileInputBoundary.execute(input);
        return updateUserProfileViewModel.getResponse();
    }

    /**
     * Change user password
     * @param userId User ID
     * @param request Change password request
     * @return Change password response
     */
    @PostMapping("/{userId}/change-password")
    public ResponseEntity<ChangePasswordResponse> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request) {
        ChangePasswordInputData input = ChangePasswordInputData.of(
            userId,
            request.getCurrentPassword(),
            request.getNewPassword(),
            request.getConfirmPassword()
        );
        changePasswordInputBoundary.execute(input);
        return changePasswordViewModel.getResponse();
    }
}
