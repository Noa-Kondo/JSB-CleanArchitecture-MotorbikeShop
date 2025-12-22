package com.motorbike.adapters.viewmodels;

import org.springframework.stereotype.Component;
import org.springframework.http.ResponseEntity;

import com.motorbike.business.dto.userprofile.UpdateUserProfileOutputData;
import com.motorbike.business.usecase.output.UpdateUserProfileOutputBoundary;
import com.motorbike.adapters.dto.response.UpdateUserProfileResponse;

@Component
public class UpdateUserProfileViewModel implements UpdateUserProfileOutputBoundary {

    private ResponseEntity<UpdateUserProfileResponse> response;

    @Override
    public void present(UpdateUserProfileOutputData outputData) {
        if (outputData == null) {
            response = ResponseEntity.status(500).body(UpdateUserProfileResponse.error("SYSTEM_ERROR", "Null output"));
            return;
        }

        if (!outputData.isSuccess()) {
            response = ResponseEntity.badRequest().body(UpdateUserProfileResponse.error(outputData.getErrorCode(), outputData.getMessage()));
            return;
        }

        UpdateUserProfileResponse.SuccessData s = new UpdateUserProfileResponse.SuccessData(
            outputData.getId(),
            outputData.getEmail(),
            outputData.getUsername(),
            outputData.getPhoneNumber(),
            outputData.getAddress(),
            outputData.getRole(),
            outputData.getUpdatedAt()
        );

        response = ResponseEntity.ok(UpdateUserProfileResponse.success(s));
    }

    public ResponseEntity<UpdateUserProfileResponse> getResponse() {
        return response;
    }
}
