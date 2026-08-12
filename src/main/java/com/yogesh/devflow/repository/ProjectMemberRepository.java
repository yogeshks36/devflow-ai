package com.yogesh.devflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.ProjectMember;
import com.yogesh.devflow.entity.User;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProject(Project project);

    Optional<ProjectMember> findByProjectAndUser(
            Project project,
            User user);

    boolean existsByProjectAndUser(
            Project project,
            User user);

    void deleteByProjectAndUser(
            Project project,
            User user);
}