package com.motorbike.business.usecase.input;

import com.motorbike.business.dto.changepassword.ChangePasswordInputData;

public interface ChangePasswordInputBoundary {
    
    void execute(ChangePasswordInputData inputData);
}
