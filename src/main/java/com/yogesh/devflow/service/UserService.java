package com.yogesh.devflow.service;

import java.util.List;

import com.yogesh.devflow.dto.request.ChangePasswordRequest;
import com.yogesh.devflow.dto.request.LoginRequest;
import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.LoginResponse;
import com.yogesh.devflow.dto.response.RegisterResponse;
import com.yogesh.devflow.dto.response.UserResponse;
import com.yogesh.devflow.dto.request.UpdateProfileRequest;
import com.yogesh.devflow.dto.request.UpdateRoleRequest;
import com.yogesh.devflow.dto.request.ChangePasswordRequest;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getCurrentUser(String email);

    List<UserResponse> getAllUsers();

    UserResponse updateProfile(
        String email,
        UpdateProfileRequest request);

    void changePassword(
        String email,
        ChangePasswordRequest request);
    
    UserResponse updateUserRole(Long userId, UpdateRoleRequest request);
}