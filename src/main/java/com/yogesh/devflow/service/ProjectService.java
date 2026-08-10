package com.yogesh.devflow.service;

import java.util.List;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(
            String email,
            ProjectRequest request);

    List<ProjectResponse> getMyProjects(
            String email);

    ProjectResponse getProjectById(
            String email,
            Long projectId);

    ProjectResponse updateProject(
            String email,
            Long projectId,
            ProjectRequest request);

    void deleteProject(
            String email,
            Long projectId);
}
