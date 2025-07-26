package com.vimal.bugtracker.dto;

import com.vimal.bugtracker.model.User.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String role;
}
