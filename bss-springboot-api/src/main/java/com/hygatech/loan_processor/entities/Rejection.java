package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rejection")
@AllArgsConstructor
@NoArgsConstructor
public class Rejection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reason;
    @Enumerated(EnumType.STRING)
    private RejectionType type;
    @ManyToOne
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;

    private Long userId;
    @CreationTimestamp
    private LocalDateTime rejectionDate;
}
