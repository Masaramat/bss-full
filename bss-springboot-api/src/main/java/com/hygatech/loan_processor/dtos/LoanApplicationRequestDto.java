package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LoanApplicationRequestDto {
    private Double amount;
    private String amountInWords;
    private LoanStatus status;
    private LocalDateTime applicationDate;
    private Integer tenor;
    private Double collateralDeposit;
    private Double searchFee;
    private Double formsFee;
    private Long appliedById;
    private Long customerId;
    private Long loanProductId;
    private Long groupId;
}
