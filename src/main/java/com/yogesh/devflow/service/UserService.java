package com.yogesh.devflow.service;

import com.yogesh.devflow.dto.request.RegisterRequest;
import com.yogesh.devflow.dto.response.RegisterResponse;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

}
