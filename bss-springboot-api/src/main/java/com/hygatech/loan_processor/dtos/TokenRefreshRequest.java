package com.hygatech.loan_processor.dtos;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class TokenRefreshRequest {
    private String refreshToken;
}
