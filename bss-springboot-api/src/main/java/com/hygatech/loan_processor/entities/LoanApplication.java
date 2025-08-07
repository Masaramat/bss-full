package com.hygatech.loan_processor.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "loan_applications")
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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



    @OneToOne
    private User appliedBy;

    @OneToOne
    private User approvedBy;

    @OneToOne
    private User disbursedBy;

    @OneToOne
    private Customer customer;

    @OneToOne
    private LoanProduct loanProduct;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true)
    @JsonBackReference
    private Group group;

}
