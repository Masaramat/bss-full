package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.RejectionType;

import java.time.LocalDateTime;

public record RejectionResponse(
        Long id,
        String reason,
        RejectionType type,
        LoanApplicationDto loanApplication,
        Long userId,
        LocalDateTime rejectionDate
) {
}
