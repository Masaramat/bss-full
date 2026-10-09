package com.hygatech.loan_processor.dtos;

import java.time.LocalDateTime;

public record AccountStatementRequest(
        Long accountId,
        LocalDateTime fromDate,
        LocalDateTime toDate
) {
}
