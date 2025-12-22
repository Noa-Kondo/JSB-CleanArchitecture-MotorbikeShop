package com.motorbike.business.usecase.control;

import java.util.Optional;

import com.motorbike.business.dto.userprofile.GetUserProfileInputData;
import com.motorbike.business.dto.userprofile.GetUserProfileOutputData;
import com.motorbike.business.ports.repository.UserRepository;
import com.motorbike.business.usecase.input.GetUserProfileInputBoundary;
import com.motorbike.business.usecase.output.GetUserProfileOutputBoundary;
import com.motorbike.domain.entities.TaiKhoan;
import com.motorbike.domain.exceptions.ValidationException;

public class GetUserProfileUseCaseControl implements GetUserProfileInputBoundary {

    private final GetUserProfileOutputBoundary outputBoundary;
    private final UserRepository userRepository;

    public GetUserProfileUseCaseControl(GetUserProfileOutputBoundary outputBoundary,
                                        UserRepository userRepository) {
        this.outputBoundary = outputBoundary;
        this.userRepository = userRepository;
    }

    @Override
    public void execute(GetUserProfileInputData input) {
        GetUserProfileOutputData outputData = null;
        Exception errorException = null;

        try {
            if (input == null || input.getUserId() == null) {
                throw ValidationException.invalidUserId();
            }
        } catch (Exception e) {
            errorException = e;
        }

        if (errorException == null) {
            try {
                Optional<TaiKhoan> opt = userRepository.findById(input.getUserId());
                if (opt.isPresent()) {
                    TaiKhoan user = opt.get();
                    outputData = GetUserProfileOutputData.forSuccess(
                        user.getMaTaiKhoan(),
                        user.getEmail(),
                        user.getTenDangNhap(),
                        user.getSoDienThoai(),
                        user.getDiaChi(),
                        user.getVaiTro().toString(),
                        user.isHoatDong(),
                        user.getNgayTao(),
                        user.getNgayCapNhat(),
                        user.getLanDangNhapCuoi()
                    );
                } else {
                    errorException = new Exception("USER_NOT_FOUND");
                }
            } catch (Exception e) {
                errorException = e;
            }
        }

        if (errorException != null) {
            String errorCode = errorException instanceof ValidationException ? 
                ((ValidationException) errorException).getErrorCode() : "SYSTEM_ERROR";
            String message = errorException.getMessage();
            outputData = GetUserProfileOutputData.forError(errorCode, message);
        }

        outputBoundary.present(outputData);
    }
}
