package com.yogesh.devflow.ai.dto;

public class TaskBreakdownItem {

    private String title;
    private String description;

    public TaskBreakdownItem() {
    }

    public TaskBreakdownItem(
            String title,
            String description) {

        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}