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
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository repository;
    private final AccountRepository accountRepository;
    private final Validator validator;
    private final AdasheSetupRepository adasheSetupRepository;
    private final AdasheCommissionRepository adasheCommissionRepository;

    private final UserRepository userRepository;

    public void createTransaction(Account account, String description, Double amount, String trxNo){
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setTrxNo(trxNo);
        repository.save(transaction);
    }

    public Transaction create(TransactionDto transactionDto){
        String trxNo = GeneralUtils.generateTransactionNumber();
        System.out.println("TransactionDto: " + transactionDto);
        System.out.println("Transaction N");
        Set<ConstraintViolation<TransactionDto>> violations = validator.validate(transactionDto);
        if (!violations.isEmpty()){
            throw new ConstraintViolationException(violations);
        }
        Account updateAccount = getAccount(transactionDto.getAccountId());
        Transaction transaction = new Transaction();
        transaction.setTrxNo(trxNo);
        transaction.setDescription(transactionDto.getDescription());
        transaction.setAccount(updateAccount);
        if(transactionDto.getUserId() != null){
            User user = getUser(transactionDto.getUserId());
            transaction.setUser(user);
        }


        if(transactionDto.getTrxType() == TransactionType.credit){
            if (updateAccount.getAccountType() == AccountType.ADASHE){
                AdasheSetup adasheSetup = getRecentAdasheSetUp();
                if (transactionDto.getAmount() < adasheSetup.getMinimumDeposit()){
                    throw new ObjectNotFoundException("Deposit insufficient");
                }
            }
            transaction.setAmount(transactionDto.getAmount());
            updateAccount.setBalance(updateAccount.getBalance() + transactionDto.getAmount());
        }else if(transactionDto.getTrxType() == TransactionType.debit){
            if(updateAccount.getAccountType() == AccountType.ADASHE){
                calculateCommission(updateAccount, transactionDto.getAmount(), trxNo);
            }

            if (transactionDto.getAmount() > updateAccount.getBalance()){
                throw new ObjectNotFoundException("Insufficient Balance");
            }
            transaction.setAmount(-transactionDto.getAmount());
            updateAccount.setBalance(updateAccount.getBalance() - transactionDto.getAmount());
        }

        accountRepository.save(updateAccount);
        System.out.println(updateAccount);
        return repository.save(transaction);
    }

    private Account getAccount(Long id){
        return accountRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Account not found"));
    }

    private AdasheSetup getRecentAdasheSetUp(){
        return adasheSetupRepository.findFirstByOrderByIdDesc().orElseThrow(() -> new ObjectNotFoundException("Setup not found"));
    }

    private AdasheCommission getLastAdasheCommissionPaid(Long accountId){
        return adasheCommissionRepository.findFirstByAccountIdOrderByIdDesc(accountId).orElse(null);
    }

    private Transaction getLastFirstDeposit(Long accountId){
        return repository.findFirstByAccountIdAndAmountGreaterThanOrderByIdAsc(accountId, 0.00).orElseThrow(() -> new ObjectNotFoundException("No deposit has been made on this account. Insufficient funds"));
    }

    private User getUser(Long userId){
        return userRepository.findById(userId).orElse(null);
    }

    private void calculateCommission(Account account, Double amount, String trxId) {
        LocalDateTime lastCommissionDate;
        double notCommissionedSavings;
        Transaction firstDeposit;

        // Determine the last commission date
        if (getLastAdasheCommissionPaid(account.getId()) == null) {
            firstDeposit = getLastFirstDeposit(account.getId());
            lastCommissionDate = firstDeposit.getTrxDate();
        } else {
            lastCommissionDate = getLastAdasheCommissionPaid(account.getId()).getTrxDate();
        }

        // Calculate the sum of deposits since the last commission
        notCommissionedSavings = repository.findSumOfDepositsByAccountIdAndTrxDateGreaterThanEqual(account, lastCommissionDate);
        long daysNotCommissioned = Duration.between(lastCommissionDate, LocalDateTime.now()).toDays();

        // Prevent division by zero
        if (daysNotCommissioned <= 0) {
            throw new IllegalArgumentException("Days not commissioned must be greater than zero.");
        }

        // Calculate average daily savings
        double averageDailySavings = notCommissionedSavings / daysNotCommissioned;

        // Calculate commission days
        int commissionDays = (int) Math.ceil(amount / averageDailySavings);

        // Calculate the commission amount
        double commission = calculateCommission(amount, commissionDays);

        // Create and save the AdasheCommission record
        AdasheCommission adasheCommission = new AdasheCommission();
        adasheCommission.setAccount(account);
        adasheCommission.setAmount(commission);
        adasheCommission.setTrxId(trxId);
        adasheCommission.setTrxDate(lastCommissionDate.plusDays(commissionDays));

        adasheCommissionRepository.save(adasheCommission);
    }

    private double calculateCommissionRate(int daysSaved, double baseCommissionRate) {
        // Calculate daily rate
        double dailyRate = baseCommissionRate / 30;
        // Return the adjusted rate for the given days
        return dailyRate * daysSaved;
    }

    private double calculateCommission(double amount, int daysSaved) {
        double baseCommissionRate = 3.33;
        // Calculate the adjusted commission rate
        double adjustedRate = calculateCommissionRate(daysSaved, baseCommissionRate);
        // Return the commission amount based on the adjusted rate
        return amount * (adjustedRate / 100);
    }

}


