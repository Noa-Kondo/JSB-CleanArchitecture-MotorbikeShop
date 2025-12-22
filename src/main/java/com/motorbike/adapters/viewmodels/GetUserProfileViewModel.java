package com.motorbike.adapters.viewmodels;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.motorbike.adapters.dto.response.GetUserProfileResponse;
import com.motorbike.business.dto.userprofile.GetUserProfileOutputData;
import com.motorbike.business.usecase.output.GetUserProfileOutputBoundary;

@Component
public class GetUserProfileViewModel implements GetUserProfileOutputBoundary {

    private ResponseEntity<GetUserProfileResponse> response;

    @Override
    public void present(GetUserProfileOutputData outputData) {
        if (outputData == null) {
            response = ResponseEntity.status(500).body(GetUserProfileResponse.error("SYSTEM_ERROR", "Null output"));
            return;
        }

        if (!outputData.isSuccess()) {
            response = ResponseEntity.badRequest().body(GetUserProfileResponse.error(outputData.getErrorCode(), outputData.getMessage()));
            return;
        }

        GetUserProfileResponse.SuccessData s = new GetUserProfileResponse.SuccessData(
            outputData.getId(),
            outputData.getEmail(),
            outputData.getUsername(),
            outputData.getPhoneNumber(),
            outputData.getAddress(),
            outputData.getRole(),
            outputData.isActive(),
            outputData.getCreatedAt(),
            outputData.getUpdatedAt(),
            outputData.getLastLoginAt()
        );

        response = ResponseEntity.ok(GetUserProfileResponse.success(s));
    }

    public ResponseEntity<GetUserProfileResponse> getResponse() {
        return response;
    }
}
