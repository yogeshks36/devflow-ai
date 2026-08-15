package com.yogesh.devflow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yogesh.devflow.ai.client.GeminiClient;
import com.yogesh.devflow.ai.dto.TaskBreakdownItem;
import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;
import com.yogesh.devflow.ai.service.impl.AiTaskBreakdownServiceImpl;
import com.yogesh.devflow.exception.AiServiceException;

@ExtendWith(MockitoExtension.class)
class AiTaskBreakdownServiceImplTest {

    @Mock
    private GeminiClient geminiClient;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AiTaskBreakdownServiceImpl aiTaskBreakdownService;

    private TaskBreakdownItem item1;
    private TaskBreakdownItem item2;
    private TaskBreakdownItem item3;

    @BeforeEach
    void setUp() {

        item1 = new TaskBreakdownItem();
        item1.setTitle("Create API");
        item1.setDescription("Create the REST endpoint");

        item2 = new TaskBreakdownItem();
        item2.setTitle("Implement service");
        item2.setDescription("Implement the business logic");

        item3 = new TaskBreakdownItem();
        item3.setTitle("Add tests");
        item3.setDescription("Write automated tests");
    }

    // ==========================================
    // TEST 1
    // VALID AI RESPONSE
    // ==========================================

    @Test
    void generateBreakdownReturnsValidResponse()
            throws Exception {

        String aiResponse = """
                [
                    {
                        "title": "Create API",
                        "description": "Create the REST endpoint"
                    },
                    {
                        "title": "Implement service",
                        "description": "Implement the business logic"
                    },
                    {
                        "title": "Add tests",
                        "description": "Write automated tests"
                    }
                ]
                """;

        TaskBreakdownItem[] items = {
                item1,
                item2,
                item3
        };

        when(geminiClient.generateContent(anyString()))
                .thenReturn(aiResponse);

        when(objectMapper.readValue(
                eq(aiResponse),
                eq(TaskBreakdownItem[].class)))
                .thenReturn(items);

        TaskBreakdownResponse response =
                aiTaskBreakdownService.generateBreakdown(
                        10L,
                        "Build authentication",
                        "Implement JWT authentication");

        assertEquals(
                3,
                response.getSteps().size());

        assertEquals(
                "Create API",
                response.getSteps().get(0).getTitle());

        verify(geminiClient)
                .generateContent(anyString());
    }

    // ==========================================
    // TEST 2
    // AI RETURNS EMPTY ARRAY
    // ==========================================

    @Test
    void emptyAiResponseThrowsException()
            throws Exception {

        String aiResponse = "[]";

        TaskBreakdownItem[] items = {};

        when(geminiClient.generateContent(anyString()))
                .thenReturn(aiResponse);

        when(objectMapper.readValue(
                eq(aiResponse),
                eq(TaskBreakdownItem[].class)))
                .thenReturn(items);

        assertThrows(
                AiServiceException.class,
                () -> aiTaskBreakdownService.generateBreakdown(
                        10L,
                        "Build authentication",
                        "Implement JWT authentication"));
    }

    // ==========================================
    // TEST 3
    // AI RETURNS INVALID NUMBER OF ITEMS
    // ==========================================

    @Test
    void invalidNumberOfItemsThrowsException()
            throws Exception {

        String aiResponse = """
                [
                    {
                        "title": "Only step",
                        "description": "Only one step"
                    }
                ]
                """;

        TaskBreakdownItem[] items = {
                item1
        };

        when(geminiClient.generateContent(anyString()))
                .thenReturn(aiResponse);

        when(objectMapper.readValue(
                eq(aiResponse),
                eq(TaskBreakdownItem[].class)))
                .thenReturn(items);

        assertThrows(
                AiServiceException.class,
                () -> aiTaskBreakdownService.generateBreakdown(
                        10L,
                        "Build authentication",
                        "Implement JWT authentication"));
    }

    // ==========================================
    // TEST 4
    // INVALID ITEM
    // ==========================================

    @Test
    void invalidItemThrowsException()
            throws Exception {

        TaskBreakdownItem invalidItem =
                new TaskBreakdownItem();

        invalidItem.setTitle("");
        invalidItem.setDescription("");

        TaskBreakdownItem[] items = {
                item1,
                item2,
                invalidItem
        };

        String aiResponse = """
                [
                    {
                        "title": "Create API",
                        "description": "Create endpoint"
                    },
                    {
                        "title": "Implement service",
                        "description": "Implement service"
                    },
                    {
                        "title": "",
                        "description": ""
                    }
                ]
                """;

        when(geminiClient.generateContent(anyString()))
                .thenReturn(aiResponse);

        when(objectMapper.readValue(
                eq(aiResponse),
                eq(TaskBreakdownItem[].class)))
                .thenReturn(items);

        assertThrows(
                AiServiceException.class,
                () -> aiTaskBreakdownService.generateBreakdown(
                        10L,
                        "Build authentication",
                        "Implement JWT authentication"));
    }

    // ==========================================
    // TEST 5
    // GEMINI CLIENT FAILURE
    // ==========================================

    @Test
    void geminiClientFailureIsPropagated() {

        when(geminiClient.generateContent(anyString()))
                .thenThrow(
                        new AiServiceException(
                                "AI provider request failed"));

        assertThrows(
                AiServiceException.class,
                () -> aiTaskBreakdownService.generateBreakdown(
                        10L,
                        "Build authentication",
                        "Implement JWT authentication"));
    }
}
