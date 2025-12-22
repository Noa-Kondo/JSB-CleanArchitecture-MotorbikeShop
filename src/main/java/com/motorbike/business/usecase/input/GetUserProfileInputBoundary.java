package com.motorbike.business.usecase.input;

import com.motorbike.business.dto.userprofile.GetUserProfileInputData;

public interface GetUserProfileInputBoundary {
    
    void execute(GetUserProfileInputData inputData);
}
