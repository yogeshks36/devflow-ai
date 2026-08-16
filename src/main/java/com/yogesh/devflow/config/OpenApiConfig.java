package com.yogesh.devflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI devFlowOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("DevFlow AI API")
                                .version("1.0.0")
                                .description(
                                        "REST API for DevFlow AI - "
                                        + "a developer project and task management platform."
                                )
                                .contact(
                                        new Contact()
                                                .name("DevFlow AI")
                                )
                )
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "bearerAuth",
                                        new SecurityScheme()
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}