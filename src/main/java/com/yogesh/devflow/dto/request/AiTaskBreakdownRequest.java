package com.yogesh.devflow.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AiTaskBreakdownRequest {

    @NotBlank(
            message = "Task description is required"
    )
    private String taskDescription;

    public AiTaskBreakdownRequest() {
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(
            String taskDescription) {

        this.taskDescription =
                taskDescription;
    }
}