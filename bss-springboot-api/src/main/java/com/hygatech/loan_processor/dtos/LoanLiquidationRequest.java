package com.hygatech.loan_processor.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record LoanLiquidationRequest(
        @NotNull(message = "Loan application ID required") Long loanApplicationId,
        @NotBlank(message = "Reason required") String liquidationReason,
        BigDecimal amount,
        BigDecimal interestCharged
) {
}
