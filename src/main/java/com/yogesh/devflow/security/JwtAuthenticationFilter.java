package com.yogesh.devflow.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("========== JWT FILTER ==========");
        System.out.println("Request: "
                + request.getMethod()
                + " "
                + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        System.out.println("Authorization header: " + authHeader);

        // No token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("No Bearer token found.");

            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String jwt = authHeader.substring(7);

        System.out.println("JWT received.");

        try {

            // Extract email
            String email = jwtService.extractEmail(jwt);

            System.out.println("JWT email: " + email);

            // Only authenticate if not already authenticated
            if (email != null
                    && SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                System.out.println(
                        "No existing authentication. Loading user..."
                );

                // Load user
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                System.out.println(
                        "User loaded: "
                                + userDetails.getUsername()
                );

                System.out.println(
                        "Authorities: "
                                + userDetails.getAuthorities()
                );

                // Validate token
                boolean valid =
                        jwtService.isTokenValid(jwt, email);

                System.out.println(
                        "JWT valid: " + valid
                );

                if (valid) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    System.out.println(
                            "AUTHENTICATION SET SUCCESSFULLY"
                    );

                    System.out.println(
                            "Authenticated user: "
                                    + SecurityContextHolder
                                            .getContext()
                                            .getAuthentication()
                                            .getName()
                    );

                    System.out.println(
                            "Authorities: "
                                    + SecurityContextHolder
                                            .getContext()
                                            .getAuthentication()
                                            .getAuthorities()
                    );

                } else {

                    System.out.println(
                            "JWT INVALID - authentication NOT set"
                    );
                }

            } else {

                System.out.println(
                        "Authentication already exists or email is null."
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "========== JWT ERROR =========="
            );

            System.out.println(
                    "Exception: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Message: "
                            + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "=============================="
            );
        }

        filterChain.doFilter(request, response);
    }
}