package com.yogesh.devflow.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;
import com.yogesh.devflow.ai.service.AiRateLimitService;
import com.yogesh.devflow.ai.service.AiTaskBreakdownService;
import com.yogesh.devflow.dto.response.TaskResponse;
import com.yogesh.devflow.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class AiTaskBreakdownController {

    private final AiTaskBreakdownService aiTaskBreakdownService;
    private final TaskService taskService;
    private final AiRateLimitService aiRateLimitService;

    public AiTaskBreakdownController(
            AiTaskBreakdownService aiTaskBreakdownService,
            TaskService taskService,
            AiRateLimitService aiRateLimitService) {

        this.aiTaskBreakdownService = aiTaskBreakdownService;
        this.taskService = taskService;
        this.aiRateLimitService = aiRateLimitService;
    }

    @PostMapping("/{taskId}/ai/breakdown")
    public ResponseEntity<TaskBreakdownResponse> generateBreakdown(
            Authentication authentication,
            @PathVariable Long taskId) {

        String email = authentication.getName();

        // Check task ownership/authorization first
        TaskResponse task =
                taskService.getTaskById(
                        email,
                        taskId
                );

        // Apply AI cooldown
        aiRateLimitService.checkAndRecord(email);

        // Call Gemini
        TaskBreakdownResponse response =
                aiTaskBreakdownService.generateBreakdown(
                        taskId,
                        task.getTitle(),
                        task.getDescription()
                );

        return ResponseEntity.ok(response);
    }
}