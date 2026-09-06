package com.yogesh.devflow.security;

import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() throws Exception {

        jwtService = new JwtService();

        Field secretField =
                JwtService.class.getDeclaredField("secret");

        secretField.setAccessible(true);

        secretField.set(
                jwtService,
                "VGhpc0lzQVNlY3VyZVNlY3JldEtleUZvckRldkZsb3dBSUphdmEyMQ=="
        );

        Field expirationField =
                JwtService.class.getDeclaredField("jwtExpiration");

        expirationField.setAccessible(true);

        expirationField.set(
                jwtService,
                3600000L
        );
    }

    @Test
    void generateTokenShouldContainUserEmail() {

        String token =
                jwtService.generateToken("user@gmail.com");

        assertNotNull(token);

        assertEquals(
                "user@gmail.com",
                jwtService.extractEmail(token)
        );
    }

    @Test
    void validTokenShouldReturnTrue() {

        String email = "user@gmail.com";

        String token =
                jwtService.generateToken(email);

        assertTrue(
                jwtService.isTokenValid(token, email)
        );
    }

    @Test
    void tokenWithWrongEmailShouldReturnFalse() {

        String token =
                jwtService.generateToken("user@gmail.com");

        assertFalse(
                jwtService.isTokenValid(
                        token,
                        "other@gmail.com"
                )
        );
    }

    @Test
    void expiredTokenShouldBeInvalid() throws Exception {

        Field expirationField =
                JwtService.class.getDeclaredField("jwtExpiration");

        expirationField.setAccessible(true);

        expirationField.set(
                jwtService,
                -1000L
        );

        String token =
                jwtService.generateToken("user@gmail.com");

        assertThrows(
            io.jsonwebtoken.ExpiredJwtException.class,
            () -> jwtService.isTokenValid(
                    token,
                    "user@gmail.com"
            )
        );
    }
}