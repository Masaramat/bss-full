package com.hygatech.loan_processor.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LoanApprovalDto {
    private Long loanId;
    private Long userid;
    private BigDecimal amountApproved;
    private String amountInWordsApproved;
    private Integer tenorApproved;
}
