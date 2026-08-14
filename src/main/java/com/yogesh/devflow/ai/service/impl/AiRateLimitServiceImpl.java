package com.yogesh.devflow.ai.service.impl;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.yogesh.devflow.ai.service.AiRateLimitService;
import com.yogesh.devflow.exception.AiRateLimitException;

@Service
public class AiRateLimitServiceImpl
        implements AiRateLimitService {

    private static final long COOLDOWN_SECONDS = 30;

    private final Map<String, Instant> lastRequestTime =
            new ConcurrentHashMap<>();

    @Override
    public void checkAndRecord(String userEmail) {

        Instant now = Instant.now();

        Instant lastRequest =
                lastRequestTime.get(userEmail);

        if (lastRequest != null) {

            long elapsedSeconds =
                    Duration.between(
                            lastRequest,
                            now
                    ).getSeconds();

            if (elapsedSeconds < COOLDOWN_SECONDS) {

                long remaining =
                        COOLDOWN_SECONDS - elapsedSeconds;

                throw new AiRateLimitException(
                        "Please wait "
                                + remaining
                                + " seconds before requesting another AI breakdown"
                );
            }
        }

        lastRequestTime.put(
                userEmail,
                now
        );
    }
}
