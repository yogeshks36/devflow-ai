package com.yogesh.devflow.service.impl;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
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

    @Override
    public ProjectResponse createProject(
            String email,
            ProjectRequest request) {

        User owner = getUserByEmail(email);

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);

        return toProjectResponse(savedProject);
    }

    @Override
    public List<ProjectResponse> getMyProjects(
            String email) {

        User owner = getUserByEmail(email);

        return projectRepository.findByOwner(owner)
                .stream()
                .map(this::toProjectResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(
            String email,
            Long projectId) {

        User currentUser = getUserByEmail(email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + projectId));

        checkOwnership(currentUser, project);

        return toProjectResponse(project);
    }

    @Override
    public ProjectResponse updateProject(
            String email,
            Long projectId,
            ProjectRequest request) {

        User currentUser = getUserByEmail(email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + projectId));

        checkOwnership(currentUser, project);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject =
                projectRepository.save(project);

        return toProjectResponse(updatedProject);
    }

    @Override
    public void deleteProject(
            String email,
            Long projectId) {

        User currentUser = getUserByEmail(email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + projectId));

        checkOwnership(currentUser, project);

        projectRepository.delete(project);
    }

    private User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));
    }

    private void checkOwnership(
            User currentUser,
            Project project) {

        if (project.getOwner() == null ||
                !project.getOwner()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new AccessDeniedException(
                    "You do not have permission to access this project");
        }
    }

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