package com.motorbike.business.usecase.output;

import com.motorbike.business.dto.userprofile.UpdateUserProfileOutputData;

public interface UpdateUserProfileOutputBoundary {
    
    void present(UpdateUserProfileOutputData outputData);
}
