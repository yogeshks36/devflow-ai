package com.yogesh.devflow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.yogesh.devflow.ai.dto.TaskBreakdownResponse;
import com.yogesh.devflow.ai.service.AiTaskBreakdownService;

@SpringBootApplication
public class DevflowAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevflowAiApplication.class, args);
    }

    @Bean
    CommandLineRunner testAi(AiTaskBreakdownService service) {

        return args -> {

            TaskBreakdownResponse result =
                    service.generateBreakdown(
                            4L,
                            "Build login page",
                            "Create an email/password login page with JWT authentication"
                    );

            System.out.println("========== AI BREAKDOWN ==========");

            result.getSteps().forEach(step -> {

                System.out.println(
                        "TITLE: " + step.getTitle()
                );

                System.out.println(
                        "DESCRIPTION: " + step.getDescription()
                );

                System.out.println("----------------------------------");
            });

            System.out.println("==================================");
        };
    }
}