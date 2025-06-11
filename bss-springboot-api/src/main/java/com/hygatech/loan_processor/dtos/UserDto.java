package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Data
@RequiredArgsConstructor
@ToString
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private Role role;
    private Boolean isEnabled;
}
