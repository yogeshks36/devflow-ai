package com.yogesh.devflow.service.impl;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.TaskRequest;
import com.yogesh.devflow.dto.response.TaskResponse;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.TaskPriority;
import com.yogesh.devflow.entity.TaskStatus;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.TaskRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.TaskService;
import com.yogesh.devflow.exception.ResourceNotFoundException;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskResponse createTask(
            String email,
            Long projectId,
            TaskRequest request) {

        User owner = getUserByEmail(email);

        Project project = getOwnedProject(projectId, owner);

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        task.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : TaskStatus.TODO
        );

        task.setPriority(
                request.getPriority() != null
                        ? request.getPriority()
                        : TaskPriority.MEDIUM
        );

        task.setDueDate(request.getDueDate());

        task.setProject(project);

        if (request.getAssigneeId() != null) {

            User assignee = userRepository.findById(
                    request.getAssigneeId()
            ).orElseThrow(() ->
                    new RuntimeException("Assignee not found")
            );

            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        return toTaskResponse(savedTask);
    }

    @Override
    public Page<TaskResponse> getProjectTasks(
            String email,
            Long projectId,
            Pageable pageable) {

        User owner = getUserByEmail(email);

        Project project = getOwnedProject(projectId, owner);

        return taskRepository
                .findByProject(project, pageable)
                .map(this::toTaskResponse);
    }

    @Override
    public TaskResponse getTaskById(
            String email,
            Long taskId) {

        User owner = getUserByEmail(email);

        Task task = getTask(taskId);

        verifyTaskOwnership(task, owner);

        return toTaskResponse(task);
    }

    @Override
    public TaskResponse updateTask(
            String email,
            Long taskId,
            TaskRequest request) {

        User owner = getUserByEmail(email);

        Task task = getTask(taskId);

        verifyTaskOwnership(task, owner);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {

            User assignee = userRepository.findById(
                    request.getAssigneeId()
            ).orElseThrow(() ->
                    new RuntimeException("Assignee not found")
            );

            task.setAssignee(assignee);

        } else {

            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);

        return toTaskResponse(updatedTask);
    }

    @Override
    public void deleteTask(
            String email,
            Long taskId) {

        User owner = getUserByEmail(email);

        Task task = getTask(taskId);

        verifyTaskOwnership(task, owner);

        taskRepository.delete(task);
    }

    private User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    private Project getOwnedProject(
            Long projectId,
            User owner) {

        return projectRepository
                .findByIdAndOwner(projectId, owner)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Project not found with id: " + projectId
                        )
                );
    }

    private Task getTask(Long taskId) {

        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Task not found with id: " + taskId
                        )
                );
    }

    private void verifyTaskOwnership(
            Task task,
            User owner) {

        if (task.getProject() == null ||
                task.getProject().getOwner() == null ||
                !task.getProject()
                        .getOwner()
                        .getId()
                        .equals(owner.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not have permission to access this task"
            );
        }
    }

    private TaskResponse toTaskResponse(Task task) {

        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());

        if (task.getProject() != null) {
            response.setProjectId(
                    task.getProject().getId()
            );
        }

        if (task.getAssignee() != null) {

            response.setAssigneeId(
                    task.getAssignee().getId()
            );

            response.setAssigneeEmail(
                    task.getAssignee().getEmail()
            );
        }

        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        return response;
    }
}
