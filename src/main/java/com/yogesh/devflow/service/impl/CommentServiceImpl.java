package com.yogesh.devflow.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.CommentRequest;
import com.yogesh.devflow.dto.response.CommentResponse;
import com.yogesh.devflow.entity.Comment;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.CommentRepository;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.TaskRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.CommentService;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public CommentServiceImpl(
            CommentRepository commentRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository) {

        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    // =========================
    // CREATE COMMENT
    // =========================

    @Override
    public CommentResponse createComment(
            String email,
            Long taskId,
            CommentRequest request) {

        User user = getUserByEmail(email);

        Task task = getTask(taskId);

        verifyProjectAccess(
                task.getProject(),
                user
        );

        Comment comment = new Comment();

        comment.setContent(
                request.getContent()
        );

        comment.setTask(task);

        comment.setUser(user);

        comment.setCreatedAt(
                java.time.LocalDateTime.now()
        );

        Comment savedComment =
                commentRepository.save(comment);

        return toResponse(savedComment);
    }

    // =========================
    // GET TASK COMMENTS
    // =========================

    @Override
    public Page<CommentResponse> getTaskComments(
            String email,
            Long taskId,
            Pageable pageable) {

        User user = getUserByEmail(email);

        Task task = getTask(taskId);

        verifyProjectAccess(
                task.getProject(),
                user
        );

        return commentRepository
                .findByTask(task, pageable)
                .map(this::toResponse);
    }

    // =========================
    // UPDATE COMMENT
    // =========================

    @Override
    public CommentResponse updateComment(
            String email,
            Long commentId,
            CommentRequest request) {

        User user = getUserByEmail(email);

        Comment comment =
                getComment(commentId);

        verifyCommentOwnership(
                comment,
                user
        );

        comment.setContent(
                request.getContent()
        );

        comment.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        Comment updatedComment =
                commentRepository.save(comment);

        return toResponse(updatedComment);
    }

    // =========================
    // DELETE COMMENT
    // =========================

    @Override
    public void deleteComment(
            String email,
            Long commentId) {

        User user = getUserByEmail(email);

        Comment comment =
                getComment(commentId);

        verifyCommentOwnership(
                comment,
                user
        );

        commentRepository.delete(comment);
    }

    // =========================
    // FIND USER
    // =========================

    private User getUserByEmail(
            String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    // =========================
    // FIND TASK
    // =========================

    private Task getTask(
            Long taskId) {

        return taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        )
                );
    }

    // =========================
    // FIND COMMENT
    // =========================

    private Comment getComment(
            Long commentId) {

        return commentRepository
                .findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment not found"
                        )
                );
    }

    // =========================
    // VERIFY PROJECT ACCESS
    // =========================

    private void verifyProjectAccess(
            Project project,
            User user) {

        if (project == null ||
                project.getOwner() == null) {

            throw new ResourceNotFoundException(
                    "Project not found"
            );
        }

        boolean isOwner =
                project.getOwner()
                        .getId()
                        .equals(user.getId());

        boolean isMember =
                projectMemberRepository
                        .existsByProjectAndUser(
                                project,
                                user
                        );

        if (!isOwner && !isMember) {

            throw new AccessDeniedException(
                    "You do not have permission to access this project"
            );
        }
    }

    // =========================
    // VERIFY COMMENT OWNER
    // =========================

    private void verifyCommentOwnership(
            Comment comment,
            User user) {

        if (comment.getUser() == null ||
                !comment.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You can only modify your own comments"
            );
        }
    }

    // =========================
    // CONVERT TO RESPONSE
    // =========================

    private CommentResponse toResponse(
            Comment comment) {

        CommentResponse response =
                new CommentResponse();

        response.setId(
                comment.getId()
        );

        response.setContent(
                comment.getContent()
        );

        if (comment.getTask() != null) {

            response.setTaskId(
                    comment.getTask().getId()
            );
        }

        if (comment.getUser() != null) {

            User user =
                    comment.getUser();

            response.setUserId(
                    user.getId()
            );

            response.setUserFirstName(
                    user.getFirstName()
            );

            response.setUserLastName(
                    user.getLastName()
            );

            response.setUserEmail(
                    user.getEmail()
            );
        }

        response.setCreatedAt(
                comment.getCreatedAt()
        );

        response.setUpdatedAt(
                comment.getUpdatedAt()
        );

        return response;
    }
}
