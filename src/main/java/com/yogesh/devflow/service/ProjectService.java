package com.yogesh.devflow.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.dto.response.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(
            String email,
            ProjectRequest request);

    Page<ProjectResponse> getMyProjects(
            String email,
            Pageable pageable);

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