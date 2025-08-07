package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.TransactionDto;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.*;
import com.hygatech.loan_processor.utils.GeneralUtils;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository repository;
    private final AccountRepository accountRepository;
    private final Validator validator;
    private final AdasheSetupRepository adasheSetupRepository;
    private final AdasheCommissionRepository adasheCommissionRepository;

    private final UserRepository userRepository;

    public void createTransaction(Account account, String description, BigDecimal amount, String trxNo){
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setTrxNo(trxNo);
        transaction.setTrxDate(LocalDateTime.now());
        repository.save(transaction);
    }

    public Transaction create(TransactionDto transactionDto) {
        log.info("Creating transaction: {}", transactionDto);
        String trxNo = GeneralUtils.generateTransactionNumber();
        Set<ConstraintViolation<TransactionDto>> violations = validator.validate(transactionDto);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Account updateAccount = getAccount(transactionDto.getAccountId());
        if (transactionDto.getUserId() != null) {
            User user = getUser(transactionDto.getUserId());
            transactionDto.setUser(user);
        }

        if (transactionDto.getTrxType() == TransactionType.credit && updateAccount.getAccountType() == AccountType.ADASHE) {
            long noOfDays = transactionDto.getNoOfDays() != 0 ? transactionDto.getNoOfDays() : 1;
            AdasheSetup adasheSetup = getRecentAdasheSetUp();

            BigDecimal dailyAmount = transactionDto.getAmount();
            if (dailyAmount.compareTo(adasheSetup.getMinimumDeposit()) < 0) {
                throw new ObjectNotFoundException("Deposit insufficient");
            }

            List<Transaction> transactions = new ArrayList<>();

            List<Transaction> finalTransactions = transactions;
            transactions = Stream.iterate(LocalDateTime.now(), date -> date.minusDays(1))
                    .filter(date -> date.getDayOfWeek() != DayOfWeek.SUNDAY)
                    .limit(noOfDays)
                    .map(date -> {
                        Transaction transaction = new Transaction();
                        transaction.setTrxNo(trxNo + "-" + (finalTransactions.size() + 1));
                        transaction.setDescription(transactionDto.getDescription() + " (Day " + (finalTransactions.size() + 1) + ")");
                        transaction.setAccount(updateAccount);
                        transaction.setUser(transactionDto.getUserId() != null ? getUser(transactionDto.getUserId()) : null);
                        transaction.setAmount(dailyAmount);
                        transaction.setTrxDate(date);
                        return transaction;
                    })
                    .collect(Collectors.toList());

            updateAccount.setBalance(updateAccount.getBalance().add(dailyAmount.multiply(BigDecimal.valueOf(noOfDays))));
            accountRepository.save(updateAccount);


            List<Transaction> savedTransactions = repository.saveAll(transactions);
            log.info("Save Transactions {}", savedTransactions);

            return savedTransactions.getFirst();
        }


        Transaction transaction = new Transaction();
        transaction.setTrxNo(trxNo);
        transaction.setDescription(transactionDto.getDescription());
        transaction.setTrxDate(LocalDateTime.now());
        transaction.setAccount(updateAccount);
        transaction.setUser(transactionDto.getUserId() != null ? getUser(transactionDto.getUserId()) : null);

        BigDecimal commission = transactionDto.getCommissionAmount() != null ? transactionDto.getCommissionAmount() : BigDecimal.ZERO;


        if (transactionDto.getTrxType() == TransactionType.credit) {
            transaction.setAmount(transactionDto.getAmount());
            updateAccount.setBalance(updateAccount.getBalance().add(transactionDto.getAmount()));
        } else if (transactionDto.getTrxType() == TransactionType.debit) {
            if (updateAccount.getAccountType() == AccountType.ADASHE) {
                if(commission.compareTo(BigDecimal.ZERO) == 0) {
                    throw new IllegalArgumentException("Commission amount is null");
                }
                saveCommission(updateAccount, transactionDto.getCommissionAmount(), trxNo);
            }
            if ((transactionDto.getAmount().add(commission)).compareTo(updateAccount.getBalance()) > 0) {
                throw new ObjectNotFoundException("Insufficient Balance");
            }
            transaction.setAmount(BigDecimal.ZERO.subtract(transactionDto.getAmount()));
            updateAccount.setBalance(updateAccount.getBalance().subtract((transactionDto.getAmount().add(commission))));
        }

        accountRepository.save(updateAccount);
        return repository.save(transaction);
    }


    private Account getAccount(Long id){
        return accountRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Account not found"));
    }

    private AdasheSetup getRecentAdasheSetUp(){
        return adasheSetupRepository.findFirstByOrderByIdDesc().orElseThrow(() -> new ObjectNotFoundException("Setup not found"));
    }

    private User getUser(Long userId){
        return userRepository.findById(userId).orElse(null);
    }

    private void saveCommission(Account account, BigDecimal amount, String trxId) {
        AdasheCommission adasheCommission = new AdasheCommission();
        adasheCommission.setAccount(account);
        adasheCommission.setAmount(amount);
        adasheCommission.setTrxId(trxId);
        adasheCommission.setTrxDate(LocalDateTime.now());
        adasheCommissionRepository.save(adasheCommission);
    }


}


