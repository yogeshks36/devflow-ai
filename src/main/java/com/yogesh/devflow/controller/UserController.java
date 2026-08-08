package com.yogesh.devflow.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yogesh.devflow.entity.User;
import com.yogesh.devflow.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // USER + ADMIN
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userService.getCurrentUser(email);
    }

    // ADMIN ONLY
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }
}
