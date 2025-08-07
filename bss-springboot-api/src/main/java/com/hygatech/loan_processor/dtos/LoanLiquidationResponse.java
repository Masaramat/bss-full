package com.hygatech.loan_processor.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoanLiquidationResponse(
        Long id,
        String message,
        LoanApplicationDto loanApplication,
        Long userId,
        BigDecimal amount,
        BigDecimal loanAmount,
        BigDecimal interestAmount,
        BigDecimal interestPaidAmount,
        LocalDateTime liquidationDate
) {
}
