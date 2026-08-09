package com.yogesh.devflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User owner);
}