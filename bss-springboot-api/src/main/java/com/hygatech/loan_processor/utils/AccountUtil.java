package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.AccountDto;
import com.hygatech.loan_processor.entities.Account;
import org.springframework.beans.BeanUtils;

public class AccountUtil {

    public static AccountDto toDto(Account account){
        AccountDto dto = new AccountDto();
        BeanUtils.copyProperties(account, dto);
        return dto;
    }
}
