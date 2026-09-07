package com.yogesh.devflow.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.yogesh.devflow.entity.Role;
import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.repository.UserRepository;
import com.yogesh.devflow.security.JwtService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final String userEmail = "security-test-user@example.com";

    @BeforeEach
    void setUp() {

        userRepository.deleteAll();

        User user = new User();

        user.setFirstName("Security");
        user.setLastName("Test");
        user.setEmail(userEmail);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(Role.USER);
        user.setVerified(true);

        userRepository.save(user);
    }

    @Test
    void protectedEndpointWithoutJwtReturns401() throws Exception {

        mockMvc.perform(
                get("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointWithInvalidJwtReturns401() throws Exception {

        mockMvc.perform(
                get("/api/users/me")
                        .header(
                                "Authorization",
                                "Bearer invalid-token"
                        )
                        .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void validUserJwtCanAccessProtectedUserEndpoint() throws Exception {

        String token = jwtService.generateToken(userEmail);

        mockMvc.perform(
                get("/api/users/me")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
                        .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());
    }

    @Test
    void normalUserCannotAccessAdminOnlyEndpoint() throws Exception {

        String token = jwtService.generateToken(userEmail);

        mockMvc.perform(
                get("/api/users")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
                        .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isForbidden());
    }
}