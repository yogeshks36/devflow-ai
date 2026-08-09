package com.yogesh.devflow.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.yogesh.devflow.dto.response.UserResponse;
import com.yogesh.devflow.service.UserService;

import com.yogesh.devflow.dto.request.UpdateProfileRequest;
import com.yogesh.devflow.dto.request.UpdateRoleRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.yogesh.devflow.dto.request.ChangePasswordRequest;

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
    public UserResponse getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userService.getCurrentUser(email);
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
    
        String email = authentication.getName();
    
        UserResponse response =
                userService.updateProfile(email, request);
    
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
 
        String email = authentication.getName();

      userService.changePassword(email, request);

        return ResponseEntity.noContent().build();
    }
    
    // ADMIN ONLY
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateRoleRequest request) {

        return ResponseEntity.ok(
                userService.updateUserRole(userId, request)
        );
    }
    // ADMIN ONLY
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }
}