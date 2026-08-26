package com.yogesh.devflow.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.TaskRequest;
import com.yogesh.devflow.dto.response.TaskResponse;
import com.yogesh.devflow.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
@Tag(
    name = "Tasks",
    description = "Task management APIs"
)
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // =========================
    // CREATE TASK
    // =========================

    @Operation(
        summary = "Create a task",
        description = "Creates a new task inside a project."
    )
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request) {

        String email = authentication.getName();

        TaskResponse response =
                taskService.createTask(
                        email,
                        projectId,
                        request
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // =========================
    // GET PROJECT TASKS
    // =========================

    @Operation(
        summary = "Get project tasks",
        description = "Returns a paginated list of tasks belonging to a project."
    )
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Page<TaskResponse>> getProjectTasks(
            Authentication authentication,
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();

        Pageable pageable =
                PageRequest.of(page, size);

        Page<TaskResponse> response =
                taskService.getProjectTasks(
                        email,
                        projectId,
                        pageable
                );

        return ResponseEntity.ok(response);
    }

    // =========================
// GET ALL TASKS
// =========================

@Operation(
    summary = "Get all tasks",
    description = "Returns all tasks belonging to projects owned by the authenticated user."
)
@GetMapping("/tasks")
public ResponseEntity<Page<TaskResponse>> getAllTasks(
        Authentication authentication,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    String email = authentication.getName();

    Pageable pageable =
            PageRequest.of(page, size);

    Page<TaskResponse> response =
            taskService.getAllTasks(
                    email,
                    pageable
            );

    return ResponseEntity.ok(response);
}

    // =========================
    // GET SINGLE TASK
    // =========================

    @Operation(
        summary = "Get task by ID",
        description = "Returns a task accessible to the authenticated user."
    )
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            Authentication authentication,
            @PathVariable Long taskId) {

        String email = authentication.getName();

        TaskResponse response =
                taskService.getTaskById(
                        email,
                        taskId
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE TASK
    // =========================

    @Operation(
        summary = "Update a task",
        description = "Updates an existing task."
    )
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request) {

        String email = authentication.getName();

        TaskResponse response =
                taskService.updateTask(
                        email,
                        taskId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE TASK
    // =========================

    @Operation(
        summary = "Delete a task",
        description = "Deletes an existing task."
    )
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable Long taskId) {

        String email = authentication.getName();

        taskService.deleteTask(
                email,
                taskId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}