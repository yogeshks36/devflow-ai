package com.yogesh.devflow.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.LoginRequest;
import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.LoginResponse;
import com.yogesh.devflow.dto.response.RegisterResponse;
import com.yogesh.devflow.dto.response.UserResponse;
import com.yogesh.devflow.entity.Role;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.exception.ResourceNotFoundException;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.security.JwtService;
import com.yogesh.devflow.service.UserService;
import com.yogesh.devflow.dto.request.UpdateProfileRequest;
import com.yogesh.devflow.dto.request.UpdateRoleRequest;
import com.yogesh.devflow.dto.request.ChangePasswordRequest;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encrypt password using BCrypt
        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        // Create new user
        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);

        // Default role
        user.setRole(Role.USER);

        // New users are not verified initially
        user.setVerified(false);

        // Save user
        User savedUser = userRepository.save(user);

        // Build response
        RegisterResponse response = new RegisterResponse();

        response.setId(savedUser.getId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());
        response.setVerified(savedUser.getVerified());

        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        // Verify password against BCrypt hash
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT
        String token = jwtService.generateToken(user.getEmail());

        // Build login response
        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
    }

    @Override
    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return toUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User updatedUser = userRepository.save(user);

        return toUserResponse(updatedUser);
    }

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

    // Verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

    // Prevent using the same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from current password");
        }

    // Encode and save new password
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    @Override
        public UserResponse updateUserRole(Long userId, UpdateRoleRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId)
                );

        user.setRole(request.getRole());

        User updatedUser = userRepository.save(user);

        return toUserResponse(updatedUser);
    }

    private UserResponse toUserResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setVerified(user.getVerified());

        return response;
    }
}