package com.yogesh.devflow.ai.dto;

import java.util.List;

public class TaskBreakdownResponse {

    private List<TaskBreakdownItem> steps;

    public TaskBreakdownResponse() {
    }

    public TaskBreakdownResponse(
            List<TaskBreakdownItem> steps) {

        this.steps = steps;
    }

    public List<TaskBreakdownItem> getSteps() {
        return steps;
    }

    public void setSteps(List<TaskBreakdownItem> steps) {
        this.steps = steps;
    }
}
