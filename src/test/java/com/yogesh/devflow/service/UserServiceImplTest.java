package com.yogesh.devflow.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.yogesh.devflow.dto.request.ChangePasswordRequest;
import com.yogesh.devflow.dto.request.LoginRequest;
import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.LoginResponse;
import com.yogesh.devflow.dto.response.RegisterResponse;
import com.yogesh.devflow.entity.Role;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.InvalidCredentialsException;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.security.JwtService;
import com.yogesh.devflow.service.impl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();

        user.setId(1L);
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@gmail.com");
        user.setPassword("encodedPassword");
        user.setRole(Role.USER);
        user.setVerified(false);
    }

    @Test
    void registerShouldCreateUserWithEncodedPassword() {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("test@gmail.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        RegisterResponse response =
                userService.register(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertEquals("test@gmail.com", response.getEmail());
        assertEquals("USER", response.getRole());
        assertFalse(response.getVerified());

        verify(passwordEncoder)
                .encode("password123");

        verify(userRepository)
                .save(any(User.class));
    }

    @Test
    void registerShouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@gmail.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("test@gmail.com"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.register(request)
                );

        assertEquals(
                "Email already exists",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void loginShouldReturnJwtToken() {

        LoginRequest request = new LoginRequest();

        request.setEmail("test@gmail.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "password123",
                "encodedPassword"))
                .thenReturn(true);

        when(jwtService.generateToken("test@gmail.com"))
                .thenReturn("jwt-token");

        LoginResponse response =
                userService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("test@gmail.com", response.getEmail());
        assertEquals("USER", response.getRole());

        verify(jwtService)
                .generateToken("test@gmail.com");
    }

    @Test
    void loginShouldRejectUnknownEmail() {

        LoginRequest request = new LoginRequest();

        request.setEmail("unknown@gmail.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        InvalidCredentialsException exception =
                assertThrows(
                        InvalidCredentialsException.class,
                        () -> userService.login(request)
                );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );

        verify(jwtService, never())
                .generateToken(anyString());
    }

    @Test
    void loginShouldRejectWrongPassword() {

        LoginRequest request = new LoginRequest();

        request.setEmail("test@gmail.com");
        request.setPassword("wrongPassword");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrongPassword",
                "encodedPassword"))
                .thenReturn(false);

        InvalidCredentialsException exception =
                assertThrows(
                        InvalidCredentialsException.class,
                        () -> userService.login(request)
                );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );

        verify(jwtService, never())
                .generateToken(anyString());
    }

    @Test
    void changePasswordShouldUpdatePassword() {

        ChangePasswordRequest request =
                new ChangePasswordRequest();

        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "oldPassword",
                "encodedPassword"))
                .thenReturn(true);

        when(passwordEncoder.matches(
                "newPassword123",
                "encodedPassword"))
                .thenReturn(false);

        when(passwordEncoder.encode("newPassword123"))
                .thenReturn("newEncodedPassword");

        userService.changePassword(
                "test@gmail.com",
                request
        );

        assertEquals(
                "newEncodedPassword",
                user.getPassword()
        );

        verify(passwordEncoder)
                .encode("newPassword123");

        verify(userRepository)
                .save(user);
    }

    @Test
    void changePasswordShouldRejectIncorrectCurrentPassword() {

        ChangePasswordRequest request =
                new ChangePasswordRequest();

        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrongPassword",
                "encodedPassword"))
                .thenReturn(false);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.changePassword(
                                "test@gmail.com",
                                request
                        )
                );

        assertEquals(
                "Current password is incorrect",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void changePasswordShouldRejectSamePassword() {

        ChangePasswordRequest request =
                new ChangePasswordRequest();

        request.setCurrentPassword("oldPassword");
        request.setNewPassword("oldPassword");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "oldPassword",
                "encodedPassword"))
                .thenReturn(true);

        // New password matches existing password
        when(passwordEncoder.matches(
                "oldPassword",
                "encodedPassword"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.changePassword(
                                "test@gmail.com",
                                request
                        )
                );

        assertEquals(
                "New password must be different from current password",
                exception.getMessage()
        );

        verify(passwordEncoder, never())
                .encode(anyString());

        verify(userRepository, never())
                .save(any(User.class));
    }
}