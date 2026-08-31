package com.yogesh.devflow.service;

import com.yogesh.devflow.dto.request.AiTaskBreakdownRequest;
import com.yogesh.devflow.dto.response.AiTaskBreakdownResponse;

public interface AiService {

    AiTaskBreakdownResponse
    generateTaskBreakdown(
            String email,
            AiTaskBreakdownRequest request
    );
}