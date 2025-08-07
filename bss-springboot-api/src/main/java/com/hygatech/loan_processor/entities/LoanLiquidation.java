package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loan_liquidation")
@AllArgsConstructor
@NoArgsConstructor
public class LoanLiquidation {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;

    private Long userId;
    private String liquidationReason;
    private BigDecimal amount;
    private BigDecimal loanAmount;
    private BigDecimal interestAmount;
    private BigDecimal interestPaidAmount;
    @CreationTimestamp
    private LocalDateTime liquidationDate;
}
