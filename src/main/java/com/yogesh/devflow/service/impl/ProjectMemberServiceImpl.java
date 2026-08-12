package com.yogesh.devflow.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.AddProjectMemberRequest;
import com.yogesh.devflow.dto.response.ProjectMemberResponse;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.ProjectMember;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.DuplicateResourceException;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.ProjectMemberService;
import org.springframework.security.access.AccessDeniedException;

@Service
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectMemberServiceImpl(
            ProjectMemberRepository projectMemberRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.projectMemberRepository = projectMemberRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // ADD MEMBER
    // =========================

    @Override
    public ProjectMemberResponse addMember(
            String ownerEmail,
            Long projectId,
            AddProjectMemberRequest request) {

        // Find project owner
        User owner = getUserByEmail(ownerEmail);

        // Only project owner can add members
        Project project = getOwnedProject(
                projectId,
                owner
        );

        // Find user who is being added
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: "
                                        + request.getEmail()
                        )
                );

        // Project owner is already part of the project
        if (user.getId().equals(owner.getId())) {

            throw new DuplicateResourceException(
                    "Project owner is already part of the project"
            );
        }

        // Prevent duplicate membership
        if (projectMemberRepository
                .existsByProjectAndUser(project, user)) {

            throw new DuplicateResourceException(
                    "User is already a project member"
            );
        }

        // Create membership
        ProjectMember member = new ProjectMember();

        member.setProject(project);
        member.setUser(user);

        ProjectMember savedMember =
                projectMemberRepository.save(member);

        return toResponse(savedMember);
    }

    // =========================
    // GET MEMBERS
    // =========================

   @Override
    public List<ProjectMemberResponse> getMembers(
            String ownerEmail,
            Long projectId) {

        User user = getUserByEmail(ownerEmail);

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"
                                )
                        );

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

         return projectMemberRepository
                 .findByProject(project)
                 .stream()
                 .map(this::toResponse)
                 .toList();
    }

    // =========================
    // REMOVE MEMBER
    // =========================

    @Override
    public void removeMember(
            String ownerEmail,
            Long projectId,
            Long userId) {

        // Find owner
        User owner = getUserByEmail(ownerEmail);

        // Make sure project belongs to owner
        Project project = getOwnedProject(
                projectId,
                owner
        );

        // Find user
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        // Find membership
        ProjectMember member =
                projectMemberRepository
                        .findByProjectAndUser(
                                project,
                                user
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project member not found"
                                )
                        );

        // Delete membership
        projectMemberRepository.delete(member);
    }

    // =========================
    // FIND USER BY EMAIL
    // =========================

    private User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }

    // =========================
    // FIND OWNED PROJECT
    // =========================

    private Project getOwnedProject(
            Long projectId,
            User owner) {

        return projectRepository
                .findByIdAndOwner(projectId, owner)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        )
                );
    }

    // =========================
    // CONVERT ENTITY TO RESPONSE
    // =========================

    private ProjectMemberResponse toResponse(
            ProjectMember member) {

        ProjectMemberResponse response =
                new ProjectMemberResponse();

        User user = member.getUser();

        response.setId(member.getId());
        response.setUserId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());

        return response;
    }
}