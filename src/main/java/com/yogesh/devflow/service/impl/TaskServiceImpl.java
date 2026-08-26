package com.yogesh.devflow.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.TaskRequest;
import com.yogesh.devflow.dto.response.TaskResponse;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.TaskPriority;
import com.yogesh.devflow.entity.TaskStatus;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.TaskRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.TaskService;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    // =========================
    // CREATE TASK
    // =========================

    @Override
    public TaskResponse createTask(
            String email,
            Long projectId,
            TaskRequest request) {

        User owner = getUserByEmail(email);

        Project project =
                getOwnedProject(projectId, owner);

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

        // =========================
        // ASSIGNEE
        // =========================

        if (request.getAssigneeId() != null) {

            User assignee =
                    userRepository
                            .findById(request.getAssigneeId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Assignee not found"
                                    )
                            );

            // Project owner can be assigned
            boolean isOwner =
                    assignee.getId()
                            .equals(owner.getId());

            // Check whether user is a project member
            boolean isMember =
                    projectMemberRepository
                            .existsByProjectAndUser(
                                    project,
                                    assignee
                            );

            // Existing user but not part of project
            if (!isOwner && !isMember) {

                throw new AccessDeniedException(
                        "User is not a member of this project"
                );
            }

            task.setAssignee(assignee);
        }

        Task savedTask =
                taskRepository.save(task);

        return toTaskResponse(savedTask);
    }

    // =========================
    // GET PROJECT TASKS
    // =========================

    @Override
    public Page<TaskResponse> getProjectTasks(
            String email,
            Long projectId,
            Pageable pageable) {

        User owner = getUserByEmail(email);

        Project project =
                getOwnedProject(projectId, owner);

        return taskRepository
                .findByProject(project, pageable)
                .map(this::toTaskResponse);
    }

    // =========================
    // GET TASK BY ID
    // =========================

    @Override
    public TaskResponse getTaskById(
            String email,
            Long taskId) {

        User owner = getUserByEmail(email);

        Task task =
                getTask(taskId);

        verifyTaskOwnership(
                task,
                owner
        );

        return toTaskResponse(task);
    }

    @Override
public Page<TaskResponse> getAllTasks(
        String email,
        Pageable pageable) {

    User owner = getUserByEmail(email);

    Page<Task> tasks =
            taskRepository.findByProjectOwner(
                    owner,
                    pageable
            );

    return tasks.map(this::toTaskResponse);
}

    // =========================
    // UPDATE TASK
    // =========================

    @Override
    public TaskResponse updateTask(
            String email,
            Long taskId,
            TaskRequest request) {

        User owner = getUserByEmail(email);

        Task task =
                getTask(taskId);

        verifyTaskOwnership(
                task,
                owner
        );

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStatus() != null) {

            task.setStatus(
                    request.getStatus()
            );
        }

        if (request.getPriority() != null) {

            task.setPriority(
                    request.getPriority()
            );
        }

        task.setDueDate(
                request.getDueDate()
        );

        // =========================
        // UPDATE ASSIGNEE
        // =========================

        if (request.getAssigneeId() != null) {

            User assignee =
                    userRepository
                            .findById(request.getAssigneeId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Assignee not found"
                                    )
                            );

            User projectOwner =
                    task.getProject().getOwner();

            // Project owner can be assigned
            boolean isOwner =
                    assignee.getId()
                            .equals(projectOwner.getId());

            // Check whether user is a project member
            boolean isMember =
                    projectMemberRepository
                            .existsByProjectAndUser(
                                    task.getProject(),
                                    assignee
                            );

            // Existing user but not part of project
            if (!isOwner && !isMember) {

                throw new AccessDeniedException(
                        "User is not a member of this project"
                );
            }

            task.setAssignee(assignee);

        } else {

            // No assigneeId means remove current assignee
            task.setAssignee(null);
        }

        Task updatedTask =
                taskRepository.save(task);

        return toTaskResponse(updatedTask);
    }

    // =========================
    // DELETE TASK
    // =========================

    @Override
    public void deleteTask(
            String email,
            Long taskId) {

        User owner =
                getUserByEmail(email);

        Task task =
                getTask(taskId);

        verifyTaskOwnership(
                task,
                owner
        );

        taskRepository.delete(task);
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
    // FIND OWNED PROJECT
    // =========================

    private Project getOwnedProject(
            Long projectId,
            User owner) {

        return projectRepository
                .findByIdAndOwner(
                        projectId,
                        owner
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        )
                );
    }

    // =========================
    // FIND TASK
    // =========================

    private Task getTask(
            Long taskId) {

        return taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        )
                );
    }

    // =========================
    // VERIFY TASK OWNERSHIP
    // =========================

    private void verifyTaskOwnership(
            Task task,
            User owner) {

        if (task.getProject() == null
                || task.getProject().getOwner() == null
                || !task.getProject()
                        .getOwner()
                        .getId()
                        .equals(owner.getId())) {

            throw new AccessDeniedException(
                    "You do not have permission to access this task"
            );
        }
    }

    // =========================
    // CONVERT TASK TO RESPONSE
    // =========================

    private TaskResponse toTaskResponse(
            Task task) {

        TaskResponse response =
                new TaskResponse();

        response.setId(
                task.getId()
        );

        response.setTitle(
                task.getTitle()
        );

        response.setDescription(
                task.getDescription()
        );

        response.setStatus(
                task.getStatus()
        );

        response.setPriority(
                task.getPriority()
        );

        response.setDueDate(
                task.getDueDate()
        );

        // =========================
        // PROJECT
        // =========================

        if (task.getProject() != null) {

            response.setProjectId(
                    task.getProject().getId()
            );
        }

        // =========================
        // ASSIGNEE
        // =========================

        if (task.getAssignee() != null) {

            response.setAssigneeId(
                    task.getAssignee().getId()
            );

            response.setAssigneeEmail(
                    task.getAssignee().getEmail()
            );
        }

        response.setCreatedAt(
                task.getCreatedAt()
        );

        response.setUpdatedAt(
                task.getUpdatedAt()
        );

        return response;
    }
}