package com.motorbike.business.usecase.output;

import com.motorbike.business.dto.userprofile.GetUserProfileOutputData;

public interface GetUserProfileOutputBoundary {
    
    void present(GetUserProfileOutputData outputData);
}
