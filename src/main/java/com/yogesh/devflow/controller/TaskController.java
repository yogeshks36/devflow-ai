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

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // =========================
    // CREATE TASK
    // =========================

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
    // GET SINGLE TASK
    // =========================

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

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable Long taskId) {

        String email = authentication.getName();

        taskService.deleteTask(
                email,
                taskId
        );

        return ResponseEntity.noContent().build();
    }
}