package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "adashe_commissions")
public class AdasheCommission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    @OneToOne
    private Account account;
    private String trxId;
    private LocalDateTime trxDate;

    @PrePersist
    protected void onCreate() {
        this.trxDate = LocalDateTime.now();
    }
}
