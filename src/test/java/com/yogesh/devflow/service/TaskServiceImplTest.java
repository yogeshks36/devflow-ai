package com.yogesh.devflow.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.Task;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.TaskRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.impl.TaskServiceImpl;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User owner;
    private User member;
    private User outsider;
    private Project project;
    private Task task;

    @BeforeEach
    void setUp() {

        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@gmail.com");

        member = new User();
        member.setId(2L);
        member.setEmail("member@gmail.com");

        outsider = new User();
        outsider.setId(3L);
        outsider.setEmail("outsider@gmail.com");

        project = new Project();
        project.setId(10L);
        project.setName("Test Project");
        project.setDescription("Test Description");
        project.setOwner(owner);

        task = new Task();
        task.setId(100L);
        task.setTitle("Test Task");
        task.setDescription("Test Task Description");
        task.setProject(project);
    }

    // ==========================================
    // TEST 1
    // OWNER CAN DELETE TASK
    // ==========================================

    @Test
    void ownerCanDeleteTask() {

        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));

        when(taskRepository.findById(100L))
                .thenReturn(Optional.of(task));

        taskService.deleteTask(
                owner.getEmail(),
                100L);

        verify(taskRepository)
                .delete(task);
    }

    // ==========================================
    // TEST 2
    // MEMBER CANNOT DELETE TASK
    // ==========================================

    @Test
    void memberCannotDeleteTask() {

        when(userRepository.findByEmail(member.getEmail()))
                .thenReturn(Optional.of(member));

        when(taskRepository.findById(100L))
                .thenReturn(Optional.of(task));

        assertThrows(
                AccessDeniedException.class,
                () -> taskService.deleteTask(
                        member.getEmail(),
                        100L));

        verify(taskRepository, never())
                .delete(any(Task.class));
    }

    // ==========================================
    // TEST 3
    // OUTSIDER CANNOT DELETE TASK
    // ==========================================

    @Test
    void outsiderCannotDeleteTask() {

        when(userRepository.findByEmail(outsider.getEmail()))
                .thenReturn(Optional.of(outsider));

        when(taskRepository.findById(100L))
                .thenReturn(Optional.of(task));

        assertThrows(
                AccessDeniedException.class,
                () -> taskService.deleteTask(
                        outsider.getEmail(),
                        100L));

        verify(taskRepository, never())
                .delete(any(Task.class));
    }
}