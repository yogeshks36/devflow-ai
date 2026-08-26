package com.yogesh.devflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByProject(
            Project project,
            Pageable pageable
    );

    Page<Task> findByProjectOwner(
            User owner,
            Pageable pageable
    );
}