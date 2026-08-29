package com.yogesh.devflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(
            message = "Comment content is required"
    )
    @Size(
            max = 2000,
            message = "Comment cannot exceed 2000 characters"
    )
    private String content;


    public CreateCommentRequest() {
    }


    public String getContent() {
        return content;
    }


    public void setContent(
            String content) {

        this.content = content;
    }

}
