package com.yogesh.devflow.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.RegisterResponse;
import com.yogesh.devflow.entity.Role;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Hash the password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Create User entity
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(Role.USER);
        user.setVerified(false);

        // Save user to database
        User savedUser = userRepository.save(user);

        // Create response DTO
        RegisterResponse response = new RegisterResponse();
        response.setId(savedUser.getId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());
        response.setVerified(savedUser.getVerified());

        return response;
    }
}