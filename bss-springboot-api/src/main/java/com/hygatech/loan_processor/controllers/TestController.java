package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.repositories.CustomerRepository;
import com.hygatech.loan_processor.repositories.LoanApplicationRepository;
import com.hygatech.loan_processor.repositories.LoanRepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    private final AccountRepository repository;
    private final CustomerRepository customerRepository;
    private final LoanApplicationRepository applicationRepository;
    private final LoanRepaymentRepository repaymentRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/savings")
    public ResponseEntity<List<Account>> generateCustomerAccounts() {
        List<Customer> customers = customerRepository.findAll();
        List<Account> accounts = new ArrayList<>();

        customers.forEach(customer -> {
            Account account = new Account();
            account.setCustomer(customer);
            account.setAccountStatus(AccountStatus.ACTIVE);

            if (customer.getCustomerType() == CustomerType.SAVINGS) {
                account.setAccountType(AccountType.SAVINGS);
            } else if (customer.getCustomerType() == CustomerType.ADASHE) {
                account.setAccountType(AccountType.ADASHE);
            }

            account.setName("Savings");
            account.setBalance(BigDecimal.ZERO);
            account.setLoanCycle(0);
            accounts.add(account);
        });

        return ResponseEntity.ok(repository.saveAll(accounts));
    }

    @GetMapping("/loans")
    public ResponseEntity<List<Account>> generateLoanAccounts() {
        List<LoanApplication> loanApplications = applicationRepository.findAll();
        List<Account> accounts = new ArrayList<>();

        for (LoanApplication loan : loanApplications) {
            Account account = new Account();
            account.setCustomer(loan.getCustomer());
            account.setAccountStatus(AccountStatus.ACTIVE);
            account.setAccountType(AccountType.LOAN);
            account.setName(loan.getLoanProduct().getName());
            account.setBalance(BigDecimal.ZERO);
            account.setLoanCycle(1);
            account.setLoanId(loan.getId());

            Optional<Account> collateralAccount = accountRepository.findAccountByAccountTypeAndCustomer(
                    AccountType.COLLATERAL_DEPOSIT, loan.getCustomer()
            );

            if (collateralAccount.isEmpty()) {
                Account newAccount = new Account();
                newAccount.setCustomer(loan.getCustomer());
                newAccount.setAccountStatus(AccountStatus.ACTIVE);
                newAccount.setAccountType(AccountType.COLLATERAL_DEPOSIT);
                newAccount.setName("Collateral Deposit");
                newAccount.setBalance(loan.getCollateralDeposit());
                newAccount.setLoanCycle(0);
                accounts.add(newAccount);
            }

            accounts.add(account);
        }

        return ResponseEntity.ok(repository.saveAll(accounts));
    }

    @GetMapping("/accounts/generate")
    public ResponseEntity<String> generateAccountNumbers() {
        List<Account> accounts = repository.findAll();
        accounts.forEach(account -> {
            account.setAccountNumber(generateAccountNumber());
            repository.save(account);
        });
        return ResponseEntity.ok("Success");
    }

    private String generateAccountNumber() {
        long timestamp = System.currentTimeMillis();
        int randomNumber = new Random().nextInt(999999);
        String randomNumberStr = String.format("%06d", randomNumber);
        String accountNumber = String.valueOf(timestamp) + randomNumberStr;

        if (accountNumber.length() > 10) {
            accountNumber = accountNumber.substring(accountNumber.length() - 9);
        }

        return "2" + accountNumber;
    }

    @GetMapping("/fix/repayments")
    public ResponseEntity<String> fixRepayments() {
        List<LoanApplication> loanApplications = applicationRepository.findAll();
        loanApplications.forEach(application -> {
            int totalWeeks = application.getTenorApproved() * 4;
            List<LoanRepayment> repayments = createRepayments(application, totalWeeks);
            repaymentRepository.saveAll(repayments);
        });

        return ResponseEntity.ok("Succeeded");
    }

    private List<LoanRepayment> createRepayments(LoanApplication loanApplication, int numOfRepayments) {
        BigDecimal approvedAmount = loanApplication.getAmountApproved();
        int tenor = loanApplication.getTenorApproved();
        BigDecimal tenorBig = BigDecimal.valueOf(tenor);

        LoanProduct product = loanApplication.getLoanProduct();

        BigDecimal interestRate = BigDecimal.valueOf(product.getInterestRate()).divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
        BigDecimal monitoringRate = BigDecimal.valueOf(product.getMonitoringFeeRate()).divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
        BigDecimal processingRate = BigDecimal.valueOf(product.getProcessingFeeRate()).divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);

        BigDecimal interest = interestRate.multiply(approvedAmount).multiply(tenorBig);
        BigDecimal monitoringFee = monitoringRate.multiply(approvedAmount).multiply(tenorBig);
        BigDecimal processingFee = processingRate.multiply(approvedAmount).multiply(tenorBig);

        BigDecimal numOfRepaymentsBig = BigDecimal.valueOf(numOfRepayments);

        BigDecimal repaymentInterest = interest.divide(numOfRepaymentsBig, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentMonitoringFee = monitoringFee.divide(numOfRepaymentsBig, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentProcessingFee = processingFee.divide(numOfRepaymentsBig, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentPrincipal = approvedAmount.divide(numOfRepaymentsBig, 2, RoundingMode.HALF_UP);

        BigDecimal repaymentTotal = repaymentInterest.add(repaymentMonitoringFee).add(repaymentProcessingFee).add(repaymentPrincipal);

        List<LoanRepayment> repayments = new ArrayList<>();
        LocalDateTime startDate = loanApplication.getDisbursedAt();

        for (int i = 0; i < numOfRepayments; i++) {
            startDate = startDate.plusWeeks(1);
            LoanRepayment repayment = new LoanRepayment();
            repayment.setApplication(loanApplication);
            repayment.setInterest(repaymentInterest);
            repayment.setStatus(RepaymentStatus.PAID);
            repayment.setMonitoringFee(repaymentMonitoringFee);
            repayment.setProcessingFee(repaymentProcessingFee);
            repayment.setPrincipal(repaymentPrincipal);
            repayment.setTotal(repaymentTotal);
            repayment.setMaturityDate(startDate);
            repayments.add(repayment);
        }

        return repayments;
    }

    @PostMapping("/update/repayment")
    public String updateRepayments(@RequestBody Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Loan Application not found"));

        List<LoanRepayment> repayments = repaymentRepository.findLoanRepaymentsByApplicationId(applicationId);
        if (repayments.isEmpty()) {
            return "No repayments found for the given application ID";
        }

        LocalDateTime repaymentStartDate = application.getDisbursedAt();
        for (LoanRepayment repayment : repayments) {
            repaymentStartDate = repaymentStartDate.plusDays(7);
            repayment.setMaturityDate(repaymentStartDate);
        }

        repaymentRepository.saveAll(repayments);
        return "Repayments updated successfully";
    }
}
