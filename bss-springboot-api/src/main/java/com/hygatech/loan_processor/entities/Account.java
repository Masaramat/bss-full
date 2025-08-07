package com.hygatech.loan_processor.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Data
@Entity
@Table(name = "accounts", uniqueConstraints = {
        @UniqueConstraint(name = "uk_account_number", columnNames = "accountNumber")
})
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus accountStatus;
    private Integer loanCycle;
    private Long loanId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private Customer customer;

    @Column(unique = true)
    private String accountNumber;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        this.accountNumber = generateAccountNumber();
    }

    private String generateAccountNumber() {
        long timestamp = System.currentTimeMillis();

        int randomNumber = new Random().nextInt(999999);

        String randomNumberStr = String.format("%06d", randomNumber);

        String accountNumber = String.valueOf(timestamp) + randomNumberStr;

        if (accountNumber.length() > 10) {
            accountNumber = accountNumber.substring(accountNumber.length() - 9);
        }

        return "2" + accountNumber;
    }
}
