package com.motorbike.business.usecase.output;

import com.motorbike.business.dto.changepassword.ChangePasswordOutputData;

public interface ChangePasswordOutputBoundary {
    
    void present(ChangePasswordOutputData outputData);
}
