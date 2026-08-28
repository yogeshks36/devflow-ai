package com.yogesh.devflow.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {

    Page<Project> findByOwner(
            User owner,
            Pageable pageable
    );

    Page<Project> findDistinctByOwnerOrMembersUser(
            User owner,
            User member,
            Pageable pageable
    );

    Optional<Project> findByIdAndOwner(
            Long id,
            User owner
    );
}