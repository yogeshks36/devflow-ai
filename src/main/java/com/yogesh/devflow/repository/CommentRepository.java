package com.yogesh.devflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yogesh.devflow.entity.Comment;
import com.yogesh.devflow.entity.Task;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    Page<Comment> findByTask(
            Task task,
            Pageable pageable
    );
}