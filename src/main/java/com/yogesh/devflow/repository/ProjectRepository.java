package com.yogesh.devflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByOwner(
        User owner,
        Pageable pageable);

    Optional<Project> findByIdAndOwner(Long id, User owner);
}