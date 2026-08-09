package com.yogesh.devflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);
}
