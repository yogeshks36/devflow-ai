package com.yogesh.devflow.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AiConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    @Bean
    public String geminiApiKey(
            @Value("${gemini.api.key}") String apiKey) {

        return apiKey;
    }

    @Bean
    public String geminiModel(
            @Value("${gemini.model}") String model) {

        return model;
    }
}