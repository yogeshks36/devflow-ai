package com.yogesh.devflow.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.yogesh.devflow.dto.request.TaskRequest;
import com.yogesh.devflow.dto.response.TaskResponse;

public interface TaskService {

    TaskResponse createTask(
            String email,
            Long projectId,
            TaskRequest request
    );

    Page<TaskResponse> getProjectTasks(
            String email,
            Long projectId,
            Pageable pageable
    );

    Page<TaskResponse> getAllTasks(
            String email,
            Pageable pageable
    );

    TaskResponse getTaskById(
            String email,
            Long taskId
    );

    TaskResponse updateTask(
            String email,
            Long taskId,
            TaskRequest request
    );

    void deleteTask(
            String email,
            Long taskId
    );
}