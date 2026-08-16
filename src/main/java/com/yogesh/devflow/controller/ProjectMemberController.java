package com.yogesh.devflow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.AddProjectMemberRequest;
import com.yogesh.devflow.dto.response.ProjectMemberResponse;
import com.yogesh.devflow.service.ProjectMemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
@Tag(
    name = "Project Members",
    description = "Project membership management APIs"
)
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    public ProjectMemberController(
            ProjectMemberService projectMemberService) {

        this.projectMemberService = projectMemberService;
    }

    // =========================
    // ADD MEMBER
    // =========================

    @Operation(
        summary = "Add a project member",
        description = "Adds a user to a project. Only the project owner can add members."
    )
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberResponse> addMember(
            Authentication authentication,
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {

        String ownerEmail = authentication.getName();

        ProjectMemberResponse response =
                projectMemberService.addMember(
                        ownerEmail,
                        projectId,
                        request
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // =========================
    // GET MEMBERS
    // =========================

    @Operation(
        summary = "Get project members",
        description = "Returns all members belonging to a project."
    )
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> getMembers(
            Authentication authentication,
            @PathVariable Long projectId) {

        String ownerEmail = authentication.getName();

        List<ProjectMemberResponse> response =
                projectMemberService.getMembers(
                        ownerEmail,
                        projectId
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // REMOVE MEMBER
    // =========================

    @Operation(
        summary = "Remove a project member",
        description = "Removes a user from a project. Only the project owner can remove members."
    )
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            Authentication authentication,
            @PathVariable Long projectId,
            @PathVariable Long userId) {

        String ownerEmail = authentication.getName();

        projectMemberService.removeMember(
                ownerEmail,
                projectId,
                userId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}