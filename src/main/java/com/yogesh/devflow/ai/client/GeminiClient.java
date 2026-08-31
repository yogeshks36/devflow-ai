package com.yogesh.devflow.ai.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yogesh.devflow.exception.AiServiceException;

@Component
public class GeminiClient {

    private static final int MAX_ATTEMPTS = 3;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final String apiKey;
    private final String model;


    public GeminiClient(
            RestClient geminiRestClient,
            ObjectMapper objectMapper,
            @Qualifier("geminiApiKey") String apiKey,
            @Qualifier("geminiModel") String model) {

        this.restClient =
                geminiRestClient;

        this.objectMapper =
                objectMapper;

        this.apiKey =
                apiKey;

        this.model =
                model;
    }


    // =========================
    // GENERATE CONTENT
    // =========================

    public String generateContent(
            String prompt) {

        if (apiKey == null ||
                apiKey.isBlank()) {

            throw new AiServiceException(
                    "Gemini API key is not configured"
            );
        }


        for (
                int attempt = 1;
                attempt <= MAX_ATTEMPTS;
                attempt++
        ) {

            try {

                return callGemini(
                        prompt
                );

            } catch (
                    HttpStatusCodeException e) {

                int statusCode =
                        e.getStatusCode()
                                .value();


                // =========================
                // TEMPORARY SERVER FAILURE
                // =========================

                if (statusCode == 503) {

                    if (attempt ==
                            MAX_ATTEMPTS) {

                        throw new AiServiceException(
                                "Gemini is temporarily "
                                + "experiencing high demand. "
                                + "Please try again in a moment.",
                                e
                        );
                    }


                    waitBeforeRetry(
                            attempt
                    );

                    continue;
                }


                // =========================
                // RATE LIMIT
                // =========================

                if (statusCode == 429) {

                    throw new AiServiceException(
                            "Gemini API rate limit reached. "
                            + "Please try again later.",
                            e
                    );
                }


                // =========================
                // INVALID API KEY
                // =========================

                if (statusCode == 401 ||
                        statusCode == 403) {

                    throw new AiServiceException(
                            "Gemini authentication failed. "
                            + "Please check your API key.",
                            e
                    );
                }


                throw new AiServiceException(
                        "Gemini API request failed",
                        e
                );

            } catch (
                    AiServiceException e) {

                throw e;

            } catch (
                    Exception e) {

                if (attempt ==
                        MAX_ATTEMPTS) {

                    throw new AiServiceException(
                            "AI provider request failed",
                            e
                    );
                }


                waitBeforeRetry(
                        attempt
                );
            }
        }


        throw new AiServiceException(
                "AI request failed"
        );
    }


    // =========================
    // CALL GEMINI
    // =========================

    private String callGemini(
            String prompt) {

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
                        }
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
                        .body(
                                requestBody
                        )
                        .retrieve()
                        .body(
                                String.class
                        );


        return extractText(
                response
        );
    }


    // =========================
    // EXTRACT TEXT
    // =========================

    private String extractText(
            String response) {

        try {

            if (response == null ||
                    response.isBlank()) {

                throw new AiServiceException(
                        "Gemini returned an empty response"
                );
            }


            JsonNode root =
                    objectMapper.readTree(
                            response
                    );


            JsonNode textNode =
                    root
                            .path(
                                    "candidates"
                            )
                            .path(0)
                            .path(
                                    "content"
                            )
                            .path(
                                    "parts"
                            )
                            .path(0)
                            .path(
                                    "text"
                            );


            if (textNode.isMissingNode() ||
                    textNode.isNull() ||
                    textNode.asText()
                            .isBlank()) {

                throw new AiServiceException(
                        "Gemini returned an unexpected response"
                );
            }


            return textNode
                    .asText();

        } catch (
                AiServiceException e) {

            throw e;

        } catch (
                Exception e) {

            throw new AiServiceException(
                    "Failed to read Gemini response",
                    e
            );
        }
    }


    // =========================
    // RETRY WAIT
    // =========================

    private void waitBeforeRetry(
            int attempt) {

        try {

            long waitTime =
                    1000L
                    * attempt;


            Thread.sleep(
                    waitTime
            );

        } catch (
                InterruptedException e) {

            Thread
                    .currentThread()
                    .interrupt();


            throw new AiServiceException(
                    "AI request interrupted",
                    e
            );
        }
    }
}