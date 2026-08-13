package com.yogesh.devflow.ai.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yogesh.devflow.exception.AiServiceException;

@Component
public class GeminiClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final String apiKey;
    private final String model;

    public GeminiClient(
            RestClient restClient,
            ObjectMapper objectMapper,
            @Qualifier("geminiApiKey") String apiKey,
            @Qualifier("geminiModel") String model) {

        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateContent(String prompt) {

        try {

            Map<String, Object> responseSchema =
                    Map.of(
                            "type", "ARRAY",
                            "items", Map.of(
                                    "type", "OBJECT",
                                    "properties", Map.of(
                                            "title", Map.of(
                                                    "type", "STRING"
                                            ),
                                            "description", Map.of(
                                                    "type", "STRING"
                                            )
                                    ),
                                    "required", new String[]{
                                            "title",
                                            "description"
                                    }
                            )
                    );

            Map<String, Object> generationConfig =
                    Map.of(
                            "responseMimeType",
                            "application/json",

                            "responseSchema",
                            responseSchema
                    );

            Map<String, Object> requestBody =
                    Map.of(
                            "contents",
                            new Object[]{
                                    Map.of(
                                            "parts",
                                            new Object[]{
                                                    Map.of(
                                                            "text",
                                                            prompt
                                                    )
                                            }
                                    )
                            },

                            "generationConfig",
                            generationConfig
                    );

            String response =
                    restClient
                            .post()
                            .uri(
                                    "/v1beta/models/"
                                            + model
                                            + ":generateContent?key="
                                            + apiKey
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .body(requestBody)
                            .retrieve()
                            .body(String.class);

            return extractTextFromGeminiEnvelope(response);

        } catch (Exception e) {

            throw new AiServiceException(
                    "AI provider request failed",
                    e
            );
        }
    }

    private String extractTextFromGeminiEnvelope(
            String response) {

        try {

            JsonNode root =
                    objectMapper.readTree(response);

            JsonNode textNode =
                    root.path("candidates")
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");

            if (textNode.isMissingNode()
                    || textNode.isNull()) {

                throw new AiServiceException(
                        "Unexpected response shape"
                );
            }

            return textNode.asText();

        } catch (AiServiceException e) {

            throw e;

        } catch (Exception e) {

            throw new AiServiceException(
                    "Unexpected response shape",
                    e
            );
        }
    }
}