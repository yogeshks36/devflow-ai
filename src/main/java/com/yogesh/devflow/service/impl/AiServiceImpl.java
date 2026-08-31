package com.yogesh.devflow.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yogesh.devflow.ai.client.GeminiClient;
import com.yogesh.devflow.ai.dto.TaskBreakdownItem;
import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;
import com.yogesh.devflow.dto.request.AiTaskBreakdownRequest;
import com.yogesh.devflow.dto.response.AiTaskBreakdownResponse;
import com.yogesh.devflow.exception.AiServiceException;
import com.yogesh.devflow.service.AiService;

@Service
public class AiServiceImpl
        implements AiService {

    private final GeminiClient geminiClient;

    private final ObjectMapper objectMapper;


    public AiServiceImpl(
            GeminiClient geminiClient,
            ObjectMapper objectMapper) {

        this.geminiClient =
                geminiClient;

        this.objectMapper =
                objectMapper;
    }


    // =========================
    // GENERATE TASK BREAKDOWN
    // =========================

    @Override
    public AiTaskBreakdownResponse
    generateTaskBreakdown(
            String email,
            AiTaskBreakdownRequest request) {


        String prompt = """
                You are an AI assistant inside a
                software development project
                management application called DevFlow AI.

                Break the following task into small,
                clear and actionable subtasks.

                Return the response as a JSON array.

                Each item must contain:

                - title
                - description

                Generate between 4 and 8 subtasks.

                Task:

                %s
                """
                .formatted(
                        request.getTaskDescription()
                );


        String generatedJson =
                geminiClient.generateContent(
                        prompt
                );


        try {

            List<TaskBreakdownItem>
                    breakdownItems =
                    objectMapper.readValue(
                            generatedJson,
                            new TypeReference<
                                    List<TaskBreakdownItem>>() {
                            }
                    );


            List<String> subtasks =
                    new ArrayList<>();


            for (TaskBreakdownItem item
                    : breakdownItems) {

                if (item.getTitle() != null
                        && !item.getTitle()
                                .isBlank()) {

                    subtasks.add(
                            item.getTitle()
                    );
                }
            }


            return new AiTaskBreakdownResponse(
                    subtasks
            );


        } catch (Exception e) {

            throw new AiServiceException(
                    "Failed to process AI response",
                    e
            );
        }
    }
}