package com.yogesh.devflow.dto.response;

import java.util.List;

public class AiTaskBreakdownResponse {

    private List<String> subtasks;

    public AiTaskBreakdownResponse() {
    }

    public AiTaskBreakdownResponse(
            List<String> subtasks) {

        this.subtasks = subtasks;
    }

    public List<String> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(
            List<String> subtasks) {

        this.subtasks = subtasks;
    }
}