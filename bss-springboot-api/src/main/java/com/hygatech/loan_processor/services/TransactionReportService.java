package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.TransactionDto;
import com.hygatech.loan_processor.dtos.TransactionReportRequest;
import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.repositories.TransactionRepository;
import com.hygatech.loan_processor.specifications.TransactionSpecification;
import com.hygatech.loan_processor.utils.TransactionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TransactionReportService {
    private final TransactionRepository repository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public Stream<TransactionDto> getTransactionReport(TransactionReportRequest request){

        return repository.findAll(TransactionSpecification.byCriteria(
                request.getTrxType(),
                request.getTrxBy(),
                request.getFromDate(),
                request.getToDate()
        )).stream().map(transaction -> {
            Account account = new Account();
            if (transaction.getAccount() != null){
                Optional<Account> accountOptional = accountRepository.findById(transaction.getAccount().getId());
                if(accountOptional.isPresent()){
                    account = accountOptional.get();
                }
            }
            return TransactionUtil.toDto(transaction, account);

        });

    }
}
