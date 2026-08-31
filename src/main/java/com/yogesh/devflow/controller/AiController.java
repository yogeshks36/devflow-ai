package com.yogesh.devflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.dto.request.AiTaskBreakdownRequest;
import com.yogesh.devflow.dto.response.AiTaskBreakdownResponse;
import com.yogesh.devflow.service.AiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
@SecurityRequirement(name = "bearerAuth")
@Tag(
        name = "AI",
        description = "AI-powered DevFlow features"
)
public class AiController {

    private final AiService aiService;

    public AiController(
            AiService aiService) {

        this.aiService =
                aiService;
    }


    @Operation(
            summary =
                    "Generate task breakdown",
            description =
                    "Generates smaller actionable subtasks using AI."
    )
    @PostMapping("/task-breakdown")
    public ResponseEntity<
            AiTaskBreakdownResponse>
    generateTaskBreakdown(

            Authentication authentication,

            @Valid
            @RequestBody
            AiTaskBreakdownRequest request) {

        String email =
                authentication.getName();


        AiTaskBreakdownResponse response =
                aiService.generateTaskBreakdown(
                        email,
                        request
                );


        return ResponseEntity.ok(
                response
        );
    }
}