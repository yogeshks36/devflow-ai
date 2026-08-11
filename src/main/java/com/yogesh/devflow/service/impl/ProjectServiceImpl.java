package com.yogesh.devflow.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
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

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);

        Project savedProject =
                projectRepository.save(project);

        return toProjectResponse(savedProject);
    }

    // =========================
    // GET MY PROJECTS
    // =========================

    @Override
    public Page<ProjectResponse> getMyProjects(
            String email,
            Pageable pageable) {

        User owner = getUserByEmail(email);

        return projectRepository
                .findByOwner(owner, pageable)
                .map(this::toProjectResponse);
    }

    // =========================
    // GET PROJECT BY ID
    // =========================

    @Override
    public ProjectResponse getProjectById(
            String email,
            Long projectId) {

        User owner = getUserByEmail(email);

        Project project =
                projectRepository
                        .findByIdAndOwner(
                                projectId,
                                owner)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"));

        return toProjectResponse(project);
    }

    // =========================
    // UPDATE PROJECT
    // =========================

    @Override
    public ProjectResponse updateProject(
            String email,
            Long projectId,
            ProjectRequest request) {

        User owner = getUserByEmail(email);

        Project project =
                projectRepository
                        .findByIdAndOwner(
                                projectId,
                                owner)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject =
                projectRepository.save(project);

        return toProjectResponse(updatedProject);
    }

    // =========================
    // DELETE PROJECT
    // =========================

    @Override
    public void deleteProject(
            String email,
            Long projectId) {

        User owner = getUserByEmail(email);

        Project project =
                projectRepository
                        .findByIdAndOwner(
                                projectId,
                                owner)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"));

        projectRepository.delete(project);
    }

    // =========================
    // FIND USER
    // =========================

    private User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));
    }

    // =========================
    // CONVERT TO RESPONSE
    // =========================

    private ProjectResponse toProjectResponse(
            Project project) {

        ProjectResponse response =
                new ProjectResponse();

        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());

        if (project.getOwner() != null) {

            response.setOwnerId(
                    project.getOwner().getId());

            response.setOwnerEmail(
                    project.getOwner().getEmail());
        }

        response.setCreatedAt(
                project.getCreatedAt());

        response.setUpdatedAt(
                project.getUpdatedAt());

        return response;
    }
}