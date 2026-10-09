package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.AccountType;

public record AccountBalanceReportRequest(
        AccountType accountType
) {
}
