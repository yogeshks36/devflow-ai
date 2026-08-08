package com.yogesh.devflow.security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        System.out.println("========== ACCESS DENIED ==========");
        System.out.println("Request: "
                + request.getMethod()
                + " "
                + request.getRequestURI());
        System.out.println("Reason: "
                + accessDeniedException.getMessage());

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        response.getWriter().write(
                "{\"error\":\"Forbidden\",\"message\":\"You do not have permission to access this resource.\"}"
        );
    }
}