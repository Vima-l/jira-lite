package com.vimal.bugtracker.dto;

import com.vimal.bugtracker.model.User.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;  // Should be "ADMIN" or "TESTER"
}
