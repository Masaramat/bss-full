package com.hygatech.loan_processor.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "transactions")
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Double amount;

    @ManyToOne()
    @JoinColumn(name = "account_id")
    @JsonBackReference
    private Account account;

    private String trxNo;
    private LocalDateTime trxDate;
    private String description;
    @ManyToOne
    private User user;

    @PrePersist
    protected void onCreate() {
        this.trxDate = LocalDateTime.now();
    }
}
