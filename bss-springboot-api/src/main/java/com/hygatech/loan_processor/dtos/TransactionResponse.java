package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.entities.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        BigDecimal amount,
        BigDecimal balance,
        Account account,
        String trxNo,
        LocalDateTime trxDate,
        String description,
        User user
) {
}
