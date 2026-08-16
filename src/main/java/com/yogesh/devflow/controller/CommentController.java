package com.yogesh.devflow.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.CommentRequest;
import com.yogesh.devflow.dto.response.CommentResponse;
import com.yogesh.devflow.service.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Tag(
    name = "Comments",
    description = "Task comment management APIs"
)
public class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService) {

        this.commentService = commentService;
    }

    // =========================
    // CREATE COMMENT
    // =========================

    @Operation(
        summary = "Create a comment",
        description = "Creates a comment on a task."
    )
    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequest request) {

        String email = authentication.getName();

        CommentResponse response =
                commentService.createComment(
                        email,
                        taskId,
                        request
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // =========================
    // GET TASK COMMENTS
    // =========================

    @Operation(
        summary = "Get task comments",
        description = "Returns a paginated list of comments for a task."
    )
    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<Page<CommentResponse>> getTaskComments(
            Authentication authentication,
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();

        Pageable pageable =
                PageRequest.of(page, size);

        Page<CommentResponse> response =
                commentService.getTaskComments(
                        email,
                        taskId,
                        pageable
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE COMMENT
    // =========================

    @Operation(
        summary = "Update a comment",
        description = "Updates an existing comment."
    )
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            Authentication authentication,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {

        String email = authentication.getName();

        CommentResponse response =
                commentService.updateComment(
                        email,
                        commentId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE COMMENT
    // =========================

    @Operation(
        summary = "Delete a comment",
        description = "Deletes an existing comment."
    )
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            Authentication authentication,
            @PathVariable Long commentId) {

        String email = authentication.getName();

        commentService.deleteComment(
                email,
                commentId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}