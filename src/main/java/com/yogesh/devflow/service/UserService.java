package com.yogesh.devflow.service;

import java.util.List;

import com.yogesh.devflow.dto.request.LoginRequest;
import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.LoginResponse;
import com.yogesh.devflow.dto.response.RegisterResponse;
import com.yogesh.devflow.entity.User;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    User getCurrentUser(String email);

    List<User> getAllUsers();
}