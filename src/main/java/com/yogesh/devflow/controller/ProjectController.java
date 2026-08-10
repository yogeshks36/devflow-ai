package com.yogesh.devflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;
import com.yogesh.devflow.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Create project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            Authentication authentication,
            @Valid @RequestBody ProjectRequest request) {

        String email = authentication.getName();

        ProjectResponse response =
                projectService.createProject(email, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all projects owned by current user
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                projectService.getMyProjects(email)
        );
    }

    // Get one project
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(
            Authentication authentication,
            @PathVariable Long projectId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                projectService.getProjectById(email, projectId)
        );
    }

    // Update project
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            Authentication authentication,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                projectService.updateProject(
                        email,
                        projectId,
                        request
                )
        );
    }

    // Delete project
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            Authentication authentication,
            @PathVariable Long projectId) {

        String email = authentication.getName();

        projectService.deleteProject(email, projectId);

        return ResponseEntity.noContent().build();
    }
}
