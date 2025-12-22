package com.motorbike.business.usecase.control;

import java.time.LocalDateTime;
import java.util.Optional;

import com.motorbike.business.dto.userprofile.UpdateUserProfileInputData;
import com.motorbike.business.dto.userprofile.UpdateUserProfileOutputData;
import com.motorbike.business.ports.repository.UserRepository;
import com.motorbike.business.usecase.input.UpdateUserProfileInputBoundary;
import com.motorbike.business.usecase.output.UpdateUserProfileOutputBoundary;
import com.motorbike.domain.entities.TaiKhoan;
import com.motorbike.domain.exceptions.ValidationException;

public class UpdateUserProfileUseCaseControl implements UpdateUserProfileInputBoundary {

    private final UpdateUserProfileOutputBoundary outputBoundary;
    private final UserRepository userRepository;

    public UpdateUserProfileUseCaseControl(UpdateUserProfileOutputBoundary outputBoundary,
                                           UserRepository userRepository) {
        this.outputBoundary = outputBoundary;
        this.userRepository = userRepository;
    }

    @Override
    public void execute(UpdateUserProfileInputData input) {
        UpdateUserProfileOutputData outputData = null;
        Exception errorException = null;

        try {
            if (input == null || input.getUserId() == null) {
                throw ValidationException.invalidUserId();
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
                if (input.phoneNumber != null && !input.phoneNumber.isBlank()) {
                    TaiKhoan.validateSoDienThoai(input.phoneNumber);
                    existing.setSoDienThoai(input.phoneNumber);
                }
                if (input.address != null && !input.address.isBlank()) {
                    existing.setDiaChi(input.address);
                }
                existing.setNgayCapNhat(LocalDateTime.now());
                TaiKhoan updated = userRepository.save(existing);
                
                outputData = UpdateUserProfileOutputData.forSuccess(
                    updated.getMaTaiKhoan(),
                    updated.getEmail(),
                    updated.getTenDangNhap(),
                    updated.getSoDienThoai(),
                    updated.getDiaChi(),
                    updated.getVaiTro().toString(),
                    updated.getNgayCapNhat()
                );
            } catch (Exception e) {
                errorException = e;
            }
        }

        if (errorException != null) {
            String errorCode = errorException instanceof ValidationException ? 
                ((ValidationException) errorException).getErrorCode() : "SYSTEM_ERROR";
            String message = errorException.getMessage();
            outputData = UpdateUserProfileOutputData.forError(errorCode, message);
        }

        outputBoundary.present(outputData);
    }
}
