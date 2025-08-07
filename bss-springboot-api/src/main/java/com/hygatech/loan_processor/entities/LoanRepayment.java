package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "loan_repayments")
public class LoanRepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private LoanApplication application;
    private BigDecimal interest;
    private BigDecimal monitoringFee;
    private BigDecimal processingFee;
    private BigDecimal principal;
    private RepaymentStatus status;
    private LocalDateTime maturityDate;
    private LocalDateTime paymentDate;
    private Long daysOverdue;
    private BigDecimal total;
    private BigDecimal totalPaid;
    private BigDecimal totalDue;
    private BigDecimal totalInterestPaid;

}
