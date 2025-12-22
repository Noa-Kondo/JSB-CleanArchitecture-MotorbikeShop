package com.motorbike.business.usecase.input;

import com.motorbike.business.dto.userprofile.UpdateUserProfileInputData;

public interface UpdateUserProfileInputBoundary {
    
    void execute(UpdateUserProfileInputData inputData);
}
