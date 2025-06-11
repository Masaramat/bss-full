package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RegistrationRequest {
    private String name;
    private String username;
    private String email;
    private Role role;
    private String password;
}
