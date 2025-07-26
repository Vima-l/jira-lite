// dto/VerifyRequest.java
package com.vimal.bugtracker.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String email;
    private String otp;

    public Object getPassword() {
        return otp;
    }
}
