package com.yogesh.devflow.ai.service;

public interface AiRateLimitService {

    void checkAndRecord(String userEmail);
}
