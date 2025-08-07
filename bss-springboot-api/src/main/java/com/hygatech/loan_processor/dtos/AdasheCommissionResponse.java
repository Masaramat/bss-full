package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdasheCommissionResponse {
    private Long id;
    private BigDecimal amount;
    private Account account;
    private String trxId;
    private LocalDateTime trxDate;
}
