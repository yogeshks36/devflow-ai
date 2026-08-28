package com.yogesh.devflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.entity.TaskPriority;
import com.yogesh.devflow.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByProject(
            Project project,
            Pageable pageable
    );

    Page<Task> findByProjectOwner(
            User owner,
            Pageable pageable
    );
    Page<Task> findByProjectOwnerAndStatus(
        User owner,
        TaskStatus status,
        Pageable pageable
);

Page<Task> findByProjectOwnerAndPriority(
        User owner,
        TaskPriority priority,
        Pageable pageable
);

Page<Task> findByProjectOwnerAndStatusAndPriority(
        User owner,
        TaskStatus status,
        TaskPriority priority,
        Pageable pageable
);
}