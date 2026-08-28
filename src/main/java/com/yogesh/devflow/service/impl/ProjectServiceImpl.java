package com.yogesh.devflow.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    // =========================
    // CREATE PROJECT
    // =========================

    @Override
    public ProjectResponse createProject(
            String email,
            ProjectRequest request) {

        User owner = getUserByEmail(email);

        Project project = new Project();

        project.setName(
                request.getName()
        );

        project.setDescription(
                request.getDescription()
        );

        project.setOwner(
                owner
        );

        Project savedProject =
                projectRepository.save(project);

        return toProjectResponse(
                savedProject
        );
    }

    // =========================
    // GET MY PROJECTS
    // OWNER + MEMBER PROJECTS
    // =========================

    @Override
    public Page<ProjectResponse> getMyProjects(
            String email,
            Pageable pageable) {

        User user =
                getUserByEmail(email);

        return projectRepository
                .findDistinctByOwnerOrMembersUser(
                        user,
                        user,
                        pageable
                )
                .map(this::toProjectResponse);
    }

    // =========================
    // GET PROJECT BY ID
    // OWNER OR MEMBER
    // =========================

    @Override
    public ProjectResponse getProjectById(
            String email,
            Long projectId) {

        User user =
                getUserByEmail(email);

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"
                                )
                        );

        boolean isOwner =
                isOwner(
                        project,
                        user
                );

        boolean isMember =
                projectMemberRepository
                        .existsByProjectAndUser(
                                project,
                                user
                        );

        if (!isOwner && !isMember) {

            throw new AccessDeniedException(
                    "You are not a member of this project"
            );
        }

        return toProjectResponse(
                project
        );
    }

    // =========================
    // UPDATE PROJECT
    // OWNER ONLY
    // =========================

    @Override
    public ProjectResponse updateProject(
            String email,
            Long projectId,
            ProjectRequest request) {

        User user =
                getUserByEmail(email);

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"
                                )
                        );

        if (!isOwner(
                project,
                user
        )) {

            throw new AccessDeniedException(
                    "Only the project owner can update this project"
            );
        }

        project.setName(
                request.getName()
        );

        project.setDescription(
                request.getDescription()
        );

        Project updatedProject =
                projectRepository.save(project);

        return toProjectResponse(
                updatedProject
        );
    }

    // =========================
    // DELETE PROJECT
    // OWNER ONLY
    // =========================

    @Override
    public void deleteProject(
            String email,
            Long projectId) {

        User user =
                getUserByEmail(email);

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"
                                )
                        );

        if (!isOwner(
                project,
                user
        )) {

            throw new AccessDeniedException(
                    "Only the project owner can delete this project"
            );
        }

        projectRepository.delete(
                project
        );
    }

    // =========================
    // CHECK PROJECT OWNER
    // =========================

    private boolean isOwner(
            Project project,
            User user) {

        return project.getOwner() != null
                && project.getOwner()
                        .getId()
                        .equals(
                                user.getId()
                        );
    }

    // =========================
    // FIND USER BY EMAIL
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
    // CONVERT ENTITY TO DTO
    // =========================

    private ProjectResponse toProjectResponse(
            Project project) {

        ProjectResponse response =
                new ProjectResponse();

        response.setId(
                project.getId()
        );

        response.setName(
                project.getName()
        );

        response.setDescription(
                project.getDescription()
        );

        // =========================
        // OWNER
        // =========================

        if (project.getOwner() != null) {

            response.setOwnerId(
                    project.getOwner().getId()
            );

            response.setOwnerEmail(
                    project.getOwner().getEmail()
            );
        }

        // =========================
        // TIMESTAMPS
        // =========================

        response.setCreatedAt(
                project.getCreatedAt()
        );

        response.setUpdatedAt(
                project.getUpdatedAt()
        );

        return response;
    }
}