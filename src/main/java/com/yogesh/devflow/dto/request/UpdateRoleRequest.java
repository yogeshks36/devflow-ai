package com.yogesh.devflow.dto.request;

import com.yogesh.devflow.entity.Role;

import jakarta.validation.constraints.NotNull;

public class UpdateRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
