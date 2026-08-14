package com.yogesh.devflow.ai.service.impl;

import java.util.Arrays;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yogesh.devflow.ai.client.GeminiClient;
import com.yogesh.devflow.ai.dto.TaskBreakdownItem;
import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;
import com.yogesh.devflow.ai.service.AiTaskBreakdownService;
import com.yogesh.devflow.exception.AiServiceException;

@Service
public class AiTaskBreakdownServiceImpl
        implements AiTaskBreakdownService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public AiTaskBreakdownServiceImpl(
            GeminiClient geminiClient,
            ObjectMapper objectMapper) {

        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    // =========================
    // GENERATE TASK BREAKDOWN
    // =========================

    @Override
    public TaskBreakdownResponse generateBreakdown(
            Long taskId,
            String title,
            String description) {

        // =========================
        // INPUT VALIDATION
        // =========================


        if (taskId == null || taskId <= 0) {
            throw new IllegalArgumentException(
                "Task ID must be a positive number"
            );
        }

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException(
                "Task title cannot be empty"
            );
        }

        if (title.length() > 200) {
            throw new IllegalArgumentException(
                "Task title cannot exceed 200 characters"
            );
        }

        if (description != null
            && description.length() > 5000) {

            throw new IllegalArgumentException(
                "Task description cannot exceed 5000 characters"
            );
        }

        // =========================
        // BUILD PROMPT
        // =========================

        String prompt = """
                Break the following software development task
                into 3 to 6 clear, actionable subtasks.

                Task ID: %d

                Title:
                %s

                Description:
                %s

                Return only the JSON array requested by the schema.
                Each item must contain:
                - title
                - description
                """.formatted(
                taskId,
                title,
                description != null
                        ? description
                        : "No description provided"
        );

        try {

            // =========================
            // CALL GEMINI
            // =========================

            String aiResponse =
                    geminiClient.generateContent(prompt);

            // =========================
            // PARSE AI RESPONSE
            // =========================

            TaskBreakdownItem[] items =
                    objectMapper.readValue(
                            aiResponse,
                            TaskBreakdownItem[].class
                    );

            // =========================
            // VALIDATE RESPONSE
            // =========================

            if (items == null
                    || items.length == 0) {

                throw new AiServiceException(
                        "AI returned an empty task breakdown"
                );
            }

            // Must contain 3 to 6 subtasks

            if (items.length < 3
                    || items.length > 6) {

                throw new AiServiceException(
                        "AI returned an invalid number of subtasks"
                );
            }

            // =========================
            // VALIDATE EACH ITEM
            // =========================

            for (TaskBreakdownItem item : items) {

                if (item == null
                        || item.getTitle() == null
                        || item.getTitle().isBlank()
                        || item.getDescription() == null
                        || item.getDescription().isBlank()) {

                    throw new AiServiceException(
                            "AI returned an invalid task breakdown item"
                    );
                }
            }

            // =========================
            // CREATE RESPONSE DTO
            // =========================

            TaskBreakdownResponse response =
                    new TaskBreakdownResponse();

            response.setSteps(
                    Arrays.asList(items)
            );

            return response;

        } catch (AiServiceException e) {

            // Preserve our custom AI exceptions

            throw e;

        } catch (Exception e) {

            // JSON parsing / unexpected errors

            throw new AiServiceException(
                    "AI returned a response that could not be parsed",
                    e
            );
        }
    }
}