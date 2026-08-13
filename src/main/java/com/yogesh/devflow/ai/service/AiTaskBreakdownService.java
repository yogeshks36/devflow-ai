package com.yogesh.devflow.ai.service;

import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;

public interface AiTaskBreakdownService {

    TaskBreakdownResponse generateBreakdown(
            Long taskId,
            String title,
            String description
    );
}
