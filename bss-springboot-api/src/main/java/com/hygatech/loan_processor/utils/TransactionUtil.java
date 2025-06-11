package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.TransactionDto;
import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.entities.Transaction;
import org.springframework.beans.BeanUtils;

public class TransactionUtil {
    public static TransactionDto toDto(Transaction transaction, Account account){
        TransactionDto dto = new TransactionDto();
        BeanUtils.copyProperties(transaction, dto);
        if (transaction.getAccount() != null){
            dto.setAccount(account);

        }

        return dto;
    }
}
