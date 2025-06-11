package com.hygatech.loan_processor.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.xml.transform.Source;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    private Long userId;
    private String password;
    private String currentPassword;
}
