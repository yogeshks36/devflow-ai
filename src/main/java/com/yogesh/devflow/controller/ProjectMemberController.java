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

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    public ProjectMemberController(
            ProjectMemberService projectMemberService) {

        this.projectMemberService = projectMemberService;
    }

    // =========================
    // ADD MEMBER
    // =========================

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
