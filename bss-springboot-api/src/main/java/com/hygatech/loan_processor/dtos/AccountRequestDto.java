package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.AccountStatus;
import com.hygatech.loan_processor.entities.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequestDto {
    private String name;
    private final AccountType accountType = AccountType.INTERNAL;
    private final AccountStatus accountStatus = AccountStatus.ACTIVE;
}
