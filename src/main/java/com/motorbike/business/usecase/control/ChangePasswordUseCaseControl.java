package com.motorbike.business.usecase.control;

import java.time.LocalDateTime;
import java.util.Optional;

import com.motorbike.business.dto.changepassword.ChangePasswordInputData;
import com.motorbike.business.dto.changepassword.ChangePasswordOutputData;
import com.motorbike.business.ports.repository.UserRepository;
import com.motorbike.business.usecase.input.ChangePasswordInputBoundary;
import com.motorbike.business.usecase.output.ChangePasswordOutputBoundary;
import com.motorbike.domain.entities.TaiKhoan;
import com.motorbike.domain.exceptions.ValidationException;

public class ChangePasswordUseCaseControl implements ChangePasswordInputBoundary {

    private final ChangePasswordOutputBoundary outputBoundary;
    private final UserRepository userRepository;

    public ChangePasswordUseCaseControl(ChangePasswordOutputBoundary outputBoundary,
                                        UserRepository userRepository) {
        this.outputBoundary = outputBoundary;
        this.userRepository = userRepository;
    }

    @Override
    public void execute(ChangePasswordInputData input) {
        ChangePasswordOutputData outputData = null;
        Exception errorException = null;

        try {
            if (input == null || input.getUserId() == null) {
                throw ValidationException.invalidUserId();
            }
            if (input.currentPassword == null || input.currentPassword.isBlank()) {
                throw ValidationException.emptyPassword();
            }
            if (input.newPassword == null || input.newPassword.isBlank()) {
                throw ValidationException.emptyPassword();
            }
            if (input.confirmPassword == null || input.confirmPassword.isBlank()) {
                throw ValidationException.emptyPassword();
            }
            if (!input.newPassword.equals(input.confirmPassword)) {
                throw new ValidationException("PASSWORD_MISMATCH", "Mật khẩu mới và xác nhận không trùng khớp");
            }
        } catch (Exception e) {
            errorException = e;
        }

        TaiKhoan existing = null;
        if (errorException == null) {
            try {
                Optional<TaiKhoan> opt = userRepository.findById(input.getUserId());
                existing = opt.orElseThrow(() -> new Exception("USER_NOT_FOUND"));
            } catch (Exception e) {
                errorException = e;
            }
        }

        if (errorException == null && existing != null) {
            try {
                // Validate current password (assuming plain text comparison for now)
                // In production, use proper password hashing/comparison
                if (!existing.getMatKhau().equals(input.currentPassword)) {
                    throw new ValidationException("INVALID_PASSWORD", "Mật khẩu hiện tại không đúng");
                }
                
                // Validate new password format
                TaiKhoan.validateMatKhau(input.newPassword);
                
                // Update password
                existing.setMatKhau(input.newPassword);
                existing.setNgayCapNhat(LocalDateTime.now());
                userRepository.save(existing);
                
                outputData = ChangePasswordOutputData.forSuccess(LocalDateTime.now());
            } catch (Exception e) {
                errorException = e;
            }
        }

        if (errorException != null) {
            String errorCode = errorException instanceof ValidationException ? 
                ((ValidationException) errorException).getErrorCode() : "SYSTEM_ERROR";
            String message = errorException.getMessage();
            outputData = ChangePasswordOutputData.forError(errorCode, message);
        }

        outputBoundary.present(outputData);
    }
}
