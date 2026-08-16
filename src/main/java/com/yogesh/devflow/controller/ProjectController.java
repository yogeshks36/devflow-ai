package com.yogesh.devflow.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;
import com.yogesh.devflow.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
@Tag(
    name = "Projects",
    description = "Project management APIs"
)
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // =========================
    // CREATE PROJECT
    // =========================

    @Operation(
        summary = "Create a project",
        description = "Creates a new project owned by the authenticated user."
    )
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            Authentication authentication,
            @Valid @RequestBody ProjectRequest request) {

        String email = authentication.getName();

        ProjectResponse response =
                projectService.createProject(
                        email,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // GET MY PROJECTS
    // =========================

    @Operation(
        summary = "Get my projects",
        description = "Returns a paginated list of projects owned by the authenticated user."
    )
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getMyProjects(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = authentication.getName();

        Pageable pageable =
                PageRequest.of(page, size);

        Page<ProjectResponse> response =
                projectService.getMyProjects(
                        email,
                        pageable
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET PROJECT BY ID
    // =========================

    @Operation(
        summary = "Get project by ID",
        description = "Returns a project owned by the authenticated user."
    )
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(
            Authentication authentication,
            @PathVariable Long projectId) {

        String email = authentication.getName();

        ProjectResponse response =
                projectService.getProjectById(
                        email,
                        projectId
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE PROJECT
    // =========================

    @Operation(
        summary = "Update a project",
        description = "Updates the name and description of a project owned by the authenticated user."
    )
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            Authentication authentication,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequest request) {

        String email = authentication.getName();

        ProjectResponse response =
                projectService.updateProject(
                        email,
                        projectId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE PROJECT
    // =========================

    @Operation(
        summary = "Delete a project",
        description = "Deletes a project owned by the authenticated user."
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            Authentication authentication,
            @PathVariable Long projectId) {

        String email = authentication.getName();

        projectService.deleteProject(
                email,
                projectId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}