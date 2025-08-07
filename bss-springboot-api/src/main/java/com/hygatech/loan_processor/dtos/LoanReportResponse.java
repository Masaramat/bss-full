package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.*;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.swing.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LoanReportResponse {
    private Long id;
    private BigDecimal amount;
    private String amountInWords;
    private LoanStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime disbursedAt;
    private LocalDateTime maturity;
    private Integer tenor;
    private BigDecimal collateralDeposit;
    private BigDecimal searchFee;
    private BigDecimal formsFee;
    private BigDecimal amountApproved;
    private String amountInWordsApproved;
    private Integer tenorApproved;
    private Long daysOverdue;
    private User appliedBy;
    private User approvedBy;
    private User disbursedBy;
    private Customer customer;
    private LoanProduct loanProduct;

    private Group group;


}
