package com.yogesh.devflow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

import com.yogesh.devflow.dto.response.ProjectResponse;
import com.yogesh.devflow.dto.request.ProjectRequest;
import com.yogesh.devflow.entity.Project;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.ProjectMemberRepository;
import com.yogesh.devflow.repository.ProjectRepository;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.impl.ProjectServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private User owner;
    private User member;
    private User outsider;
    private Project project;

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
    }

    // ==========================================
    // TEST 1
    // OWNER CAN VIEW PROJECT
    // ==========================================

    @Test
    void ownerCanViewProject() {

        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));

        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));

        when(projectMemberRepository
                .existsByProjectAndUser(project, owner))
                .thenReturn(false);

        ProjectResponse response =
                projectService.getProjectById(
                        owner.getEmail(),
                        10L);

        assertEquals(
                10L,
                response.getId());

        assertEquals(
                "Test Project",
                response.getName());
    }

    // ==========================================
    // TEST 2
    // MEMBER CAN VIEW PROJECT
    // ==========================================

    @Test
    void memberCanViewProject() {

        when(userRepository.findByEmail(member.getEmail()))
                .thenReturn(Optional.of(member));

        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));

        when(projectMemberRepository
                .existsByProjectAndUser(project, member))
                .thenReturn(true);

        ProjectResponse response =
                projectService.getProjectById(
                        member.getEmail(),
                        10L);

        assertEquals(
                10L,
                response.getId());

        assertEquals(
                "Test Project",
                response.getName());
    }

    // ==========================================
    // TEST 3
    // OUTSIDER CANNOT VIEW PROJECT
    // ==========================================

    @Test
    void outsiderCannotViewProject() {

        when(userRepository.findByEmail(outsider.getEmail()))
                .thenReturn(Optional.of(outsider));

        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));

        when(projectMemberRepository
                .existsByProjectAndUser(project, outsider))
                .thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> projectService.getProjectById(
                        outsider.getEmail(),
                        10L));
    }

    // ==========================================
    // TEST 4
    // NON-EXISTENT PROJECT
    // ==========================================

    @Test
    void nonExistentProjectThrowsException() {

        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> projectService.getProjectById(
                        owner.getEmail(),
                        999L));
    }

    // ==========================================
    // TEST 5
    // OWNER CAN UPDATE PROJECT
    // ==========================================

    @Test
    void ownerCanUpdateProject() {

        ProjectRequest request =
                new ProjectRequest();

        request.setName("Updated Project");
        request.setDescription("Updated Description");

        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));

        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));

        when(projectRepository.save(project))
                .thenReturn(project);

        ProjectResponse response =
                projectService.updateProject(
                        owner.getEmail(),
                        10L,
                        request);

        assertEquals(
                "Updated Project",
                response.getName());

        assertEquals(
                "Updated Description",
                response.getDescription());

        verify(projectRepository)
                .save(project);
    }

    // ==========================================
    // TEST 6
    // MEMBER CANNOT UPDATE PROJECT
    // ==========================================
    
    @Test
    void memberCannotUpdateProject() {
    
        ProjectRequest request =
                new ProjectRequest();
    
        request.setName("Unauthorized Update");
        request.setDescription("Should not be allowed");
    
        when(userRepository.findByEmail(member.getEmail()))
                .thenReturn(Optional.of(member));
    
        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));
    
        assertThrows(
                AccessDeniedException.class,
                () -> projectService.updateProject(
                        member.getEmail(),
                        10L,
                        request));
    
        verify(projectRepository, never())
                .save(any(Project.class));
    }

    // ==========================================
    // TEST 7
    // MEMBER CANNOT DELETE PROJECT
    // ==========================================
    
    @Test
    void memberCannotDeleteProject() {
    
        when(userRepository.findByEmail(member.getEmail()))
                .thenReturn(Optional.of(member));
    
        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));
    
        assertThrows(
                AccessDeniedException.class,
                () -> projectService.deleteProject(
                        member.getEmail(),
                        10L));
    
        verify(projectRepository, never())
                .delete(any(Project.class));
    }

    // ==========================================
    // TEST 8
    // OWNER CAN DELETE PROJECT
    // ==========================================
    
    @Test
    void ownerCanDeleteProject() {
    
        when(userRepository.findByEmail(owner.getEmail()))
                .thenReturn(Optional.of(owner));
    
        when(projectRepository.findById(10L))
                .thenReturn(Optional.of(project));
    
        projectService.deleteProject(
                owner.getEmail(),
                10L);
    
        verify(projectRepository)
                .delete(project);
    }
}
