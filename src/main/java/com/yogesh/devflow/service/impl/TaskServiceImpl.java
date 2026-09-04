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

        User user =
                getUserByEmail(email);


        // Owner OR project member
        Project project =
                getAccessibleProject(
                        projectId,
                        user
                );


        Task task =
                new Task();


        task.setTitle(
                request.getTitle()
        );


        task.setDescription(
                request.getDescription()
        );


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


        task.setDueDate(
                request.getDueDate()
        );


        task.setProject(
                project
        );


        // =========================
        // ASSIGNEE
        // =========================

        if (
                request.getAssigneeId() != null
        ) {

            User assignee =
                    userRepository
                            .findById(
                                    request.getAssigneeId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Assignee not found"
                                    )
                            );


            // =========================
            // PROJECT OWNER
            // =========================

            boolean isProjectOwner =
                    assignee.getId()
                            .equals(
                                    project
                                            .getOwner()
                                            .getId()
                            );


            // =========================
            // PROJECT MEMBER
            // =========================

            boolean isProjectMember =
                    projectMemberRepository
                            .existsByProjectAndUser(
                                    project,
                                    assignee
                            );


            // =========================
            // VALIDATE ASSIGNEE
            // =========================

            if (
                    !isProjectOwner
                            &&
                    !isProjectMember
            ) {

                throw new AccessDeniedException(
                        "User is not a member of this project"
                );
            }


            task.setAssignee(
                    assignee
            );
        }


        Task savedTask =
                taskRepository.save(
                        task
                );


        return toTaskResponse(
                savedTask
        );
    }


    // =========================
    // GET PROJECT TASKS
    // =========================

    @Override
    public Page<TaskResponse> getProjectTasks(
            String email,
            Long projectId,
            Pageable pageable) {

        User user =
                getUserByEmail(email);


        // Owner OR project member
        Project project =
                getAccessibleProject(
                        projectId,
                        user
                );


        return taskRepository
                .findByProject(
                        project,
                        pageable
                )
                .map(
                        this::toTaskResponse
                );
    }


    // =========================
    // GET ALL TASKS
    // =========================

    @Override
    public Page<TaskResponse> getAllTasks(
            String email,
            TaskStatus status,
            TaskPriority priority,
            Pageable pageable) {

        User user =
                getUserByEmail(email);


        Page<Task> tasks;


        if (
                status != null
                        &&
                priority != null
        ) {

            tasks =
                    taskRepository
                            .findByProjectOwnerAndStatusAndPriority(
                                    user,
                                    status,
                                    priority,
                                    pageable
                            );

        } else if (
                status != null
        ) {

            tasks =
                    taskRepository
                            .findByProjectOwnerAndStatus(
                                    user,
                                    status,
                                    pageable
                            );

        } else if (
                priority != null
        ) {

            tasks =
                    taskRepository
                            .findByProjectOwnerAndPriority(
                                    user,
                                    priority,
                                    pageable
                            );

        } else {

            tasks =
                    taskRepository
                            .findByProjectOwner(
                                    user,
                                    pageable
                            );
        }


        return tasks.map(
                this::toTaskResponse
        );
    }


    // =========================
    // GET TASK BY ID
    // =========================

    @Override
    public TaskResponse getTaskById(
            String email,
            Long taskId) {

        User user =
                getUserByEmail(email);


        Task task =
                getTask(
                        taskId
                );


        // Owner OR member access
        verifyTaskAccess(
                task,
                user
        );


        return toTaskResponse(
                task
        );
    }


    // =========================
    // UPDATE TASK
    // =========================

    @Override
    public TaskResponse updateTask(
            String email,
            Long taskId,
            TaskRequest request) {

        User user =
                getUserByEmail(email);


        Task task =
                getTask(
                        taskId
                );


        // Owner OR member access
        verifyTaskAccess(
                task,
                user
        );


        task.setTitle(
                request.getTitle()
        );


        task.setDescription(
                request.getDescription()
        );


        if (
                request.getStatus() != null
        ) {

            task.setStatus(
                    request.getStatus()
            );
        }


        if (
                request.getPriority() != null
        ) {

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

        if (
                request.getAssigneeId() != null
        ) {

            User assignee =
                    userRepository
                            .findById(
                                    request.getAssigneeId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Assignee not found"
                                    )
                            );


            Project project =
                    task.getProject();


            boolean isProjectOwner =
                    assignee.getId()
                            .equals(
                                    project
                                            .getOwner()
                                            .getId()
                            );


            boolean isProjectMember =
                    projectMemberRepository
                            .existsByProjectAndUser(
                                    project,
                                    assignee
                            );


            if (
                    !isProjectOwner
                            &&
                    !isProjectMember
            ) {

                throw new AccessDeniedException(
                        "User is not a member of this project"
                );
            }


            task.setAssignee(
                    assignee
            );

        } else {

            // Remove assignee
            task.setAssignee(
                    null
            );
        }


        Task updatedTask =
                taskRepository.save(
                        task
                );


        return toTaskResponse(
                updatedTask
        );
    }


    // =========================
    // DELETE TASK
    // =========================

    @Override
    public void deleteTask(
            String email,
            Long taskId) {

        User user =
                getUserByEmail(email);


        Task task =
                getTask(
                        taskId
                );


        // IMPORTANT:
        // Only project owner can delete
        verifyTaskOwnership(
                task,
                user
        );


        taskRepository.delete(
                task
        );
    }


    // =========================
    // FIND USER BY EMAIL
    // =========================

    private User getUserByEmail(
            String email) {

        return userRepository
                .findByEmail(
                        email
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }


    // =========================
    // PROJECT ACCESS
    // OWNER OR MEMBER
    // =========================

    private Project getAccessibleProject(
            Long projectId,
            User user) {

        Project project =
                projectRepository
                        .findById(
                                projectId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"
                                )
                        );


        boolean isOwner =
                project
                        .getOwner()
                        .getId()
                        .equals(
                                user.getId()
                        );


        boolean isMember =
                projectMemberRepository
                        .existsByProjectAndUser(
                                project,
                                user
                        );


        if (
                !isOwner
                        &&
                !isMember
        ) {

            throw new AccessDeniedException(
                    "You do not have access to this project"
            );
        }


        return project;
    }


    // =========================
    // FIND TASK
    // =========================

    private Task getTask(
            Long taskId) {

        return taskRepository
                .findById(
                        taskId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found"
                        )
                );
    }


    // =========================
    // VERIFY TASK ACCESS
    // OWNER OR MEMBER
    // =========================

    private void verifyTaskAccess(
            Task task,
            User user) {

        if (
                task.getProject() == null
        ) {

            throw new AccessDeniedException(
                    "Task does not belong to a project"
            );
        }


        Project project =
                task.getProject();


        boolean isOwner =
                project
                        .getOwner()
                        .getId()
                        .equals(
                                user.getId()
                        );


        boolean isMember =
                projectMemberRepository
                        .existsByProjectAndUser(
                                project,
                                user
                        );


        if (
                !isOwner
                        &&
                !isMember
        ) {

            throw new AccessDeniedException(
                    "You do not have permission to access this task"
            );
        }
    }


    // =========================
    // VERIFY TASK OWNERSHIP
    // OWNER ONLY
    // =========================

    private void verifyTaskOwnership(
            Task task,
            User user) {

        if (
                task.getProject() == null
                        ||
                task.getProject().getOwner() == null
                        ||
                !task
                        .getProject()
                        .getOwner()
                        .getId()
                        .equals(
                                user.getId()
                        )
        ) {

            throw new AccessDeniedException(
                    "Only the project owner can perform this action"
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

        if (
                task.getProject() != null
        ) {

            response.setProjectId(
                    task
                            .getProject()
                            .getId()
            );
        }


        // =========================
        // ASSIGNEE
        // =========================

        if (
                task.getAssignee() != null
        ) {

            response.setAssigneeId(
                    task
                            .getAssignee()
                            .getId()
            );


            response.setAssigneeEmail(
                    task
                            .getAssignee()
                            .getEmail()
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