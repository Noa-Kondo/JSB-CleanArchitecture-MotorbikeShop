package com.motorbike.adapters.viewmodels;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.motorbike.adapters.dto.response.ChangePasswordResponse;
import com.motorbike.business.dto.changepassword.ChangePasswordOutputData;
import com.motorbike.business.usecase.output.ChangePasswordOutputBoundary;

@Component
public class ChangePasswordViewModelImpl implements ChangePasswordOutputBoundary {

    private ResponseEntity<ChangePasswordResponse> response;

    @Override
    public void present(ChangePasswordOutputData outputData) {
        if (outputData == null) {
            response = ResponseEntity.status(500).body(ChangePasswordResponse.error("SYSTEM_ERROR", "Null output"));
            return;
        }

        if (!outputData.isSuccess()) {
            response = ResponseEntity.badRequest().body(ChangePasswordResponse.error(outputData.getErrorCode(), outputData.getMessage()));
            return;
        }

        ChangePasswordResponse s = ChangePasswordResponse.success("Đổi mật khẩu thành công", outputData.getChangedAt());

        response = ResponseEntity.ok(s);
    }

    public ResponseEntity<ChangePasswordResponse> getResponse() {
        return response;
    }
}
