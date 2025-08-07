package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.RejectionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RejectionRequest(
        @NotBlank(message = "Reason must be given") String reason,
        @NotNull(message = "Rejection type ust be present") RejectionType type,
        @NotNull(message = "Loan ID must be present") Long loanId
) {


}
