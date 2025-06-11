package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.AccountStatus;
import com.hygatech.loan_processor.entities.AccountType;
import com.hygatech.loan_processor.entities.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AccountDto {
    private Long id;
    private String name;
    private String accountNumber;
    private AccountType accountType;
    private Double balance;
    private AccountStatus accountStatus;
    private Integer loanCycle;
    private Customer customer;
    private Long loanId;

    private LocalDateTime createdAt;
}
