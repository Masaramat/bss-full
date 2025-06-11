package com.hygatech.loan_processor.dtos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.entities.TransactionType;
import com.hygatech.loan_processor.entities.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDto {

    private UUID id;

    private String trxNo;
    private LocalDateTime trxDate;
    @NotNull
    private Double amount;

    private TransactionType trxType;
    @NotNull
    private Long accountId;
    private Long userId;

    @NotBlank
    private String description;
    private Account account;
    private User user;
}
