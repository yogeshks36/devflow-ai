package com.yogesh.devflow.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.yogesh.devflow.dto.request.CommentRequest;
import com.yogesh.devflow.dto.response.CommentResponse;

public interface CommentService {

    CommentResponse createComment(
            String email,
            Long taskId,
            CommentRequest request
    );

    Page<CommentResponse> getTaskComments(
            String email,
            Long taskId,
            Pageable pageable
    );

    CommentResponse updateComment(
            String email,
            Long commentId,
            CommentRequest request
    );

    void deleteComment(
            String email,
            Long commentId
    );
}