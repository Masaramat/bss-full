package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.AccountBalanceReportRequest;
import com.hygatech.loan_processor.dtos.AccountDto;
import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.utils.AccountUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountBalanceReportService {
    private  final AccountRepository repository;

    public List<AccountDto> getAccountBalanceReport(AccountBalanceReportRequest request){

        List<Account> accounts;

        if(request.accountType() != null){
            accounts = repository.findAllByAccountType(request.accountType());
        }else {
            accounts = repository.findAll();
        }


        return accounts.stream().map(AccountUtil::toDto).toList();

    }
}
