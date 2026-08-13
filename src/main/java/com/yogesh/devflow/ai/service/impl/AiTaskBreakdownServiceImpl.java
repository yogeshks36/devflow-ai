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

    @Override
    public TaskBreakdownResponse generateBreakdown(
            Long taskId,
            String title,
            String description) {

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
                description != null ? description : "No description provided"
        );

        try {

            String aiResponse =
                    geminiClient.generateContent(prompt);

            TaskBreakdownItem[] items =
                    objectMapper.readValue(
                            aiResponse,
                            TaskBreakdownItem[].class
                    );

            if (items == null || items.length == 0) {

                throw new AiServiceException(
                        "AI returned an empty task breakdown"
                );
            }

            TaskBreakdownResponse response =
                    new TaskBreakdownResponse();

            response.setSteps(
                    Arrays.asList(items)
            );

            return response;

        } catch (AiServiceException e) {

            throw e;

        } catch (Exception e) {

            throw new AiServiceException(
                    "AI returned a response that could not be parsed",
                    e
            );
        }
    }
}
