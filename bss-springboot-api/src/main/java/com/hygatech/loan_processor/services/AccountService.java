package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.AccountDto;
import com.hygatech.loan_processor.dtos.AccountRequestDto;
import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.repositories.CustomerRepository;
import com.hygatech.loan_processor.utils.AccountUtil;
import com.sun.source.doctree.SeeTree;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository repository;
    private final CustomerRepository customerRepository;

    public AccountDto create(AccountRequestDto requestDto){
        try {
            Account account = new Account();
            account.setName(requestDto.getName());
            account.setAccountType(requestDto.getAccountType());
            account.setAccountStatus(requestDto.getAccountStatus());
            account.setBalance(BigDecimal.ZERO);

            return AccountUtil.toDto(repository.save(account));

        }catch (RuntimeException ex){
            throw new RuntimeException(ex.getMessage());
        }
    }

    public AccountDto find(Long accountId){
        Optional<Account> accountOptional = repository.findById(accountId);
        if(accountOptional.isEmpty()){
            throw new ObjectNotFoundException("Account not found");
        }
        return AccountUtil.toDto(accountOptional.get());
    }

    public Stream<AccountDto> findByCustomer(Long customerId){

        return repository.findAccountsByCustomerId(customerId).stream().map(AccountUtil::toDto);
    }
}
