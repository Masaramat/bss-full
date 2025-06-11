package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.repositories.CustomerRepository;
import com.hygatech.loan_processor.repositories.LoanApplicationRepository;
import com.hygatech.loan_processor.repositories.LoanRepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    private final AccountRepository repository;
    private final CustomerRepository customerRepository;
    private final LoanApplicationRepository applicationRepository;
    private final LoanRepaymentRepository repaymentRepository;

    @GetMapping("/savings")
    public ResponseEntity<List<Account>> generateCustomerAccounts(){
        List<Customer> customers = customerRepository.findAll();
        List<Account> accounts = new ArrayList<>();

        customers.forEach(customer -> {
            Account account = new Account();
            account.setCustomer(customer);
            account.setAccountStatus(AccountStatus.ACTIVE);
            account.setAccountType(AccountType.SAVINGS);
            account.setName("Savings");
            account.setBalance(0.00);
            account.setLoanCycle(0);
            accounts.add(account);
        });

        return ResponseEntity.ok(repository.saveAll(accounts));

    }

    @GetMapping("/loans")
    public ResponseEntity<List<Account>> generateLoanAccounts(){
        List<LoanApplication> loanApplications = applicationRepository.findAll();
        List<Account> accounts = new ArrayList<>();

        loanApplications.forEach(loan -> {
            Account account = new Account();
            account.setCustomer(loan.getCustomer());
            account.setAccountStatus(AccountStatus.CLOSED);
            account.setAccountType(AccountType.LOAN);
            account.setName(loan.getLoanProduct().getName());
            account.setBalance(0.00);
            account.setLoanCycle(1);
            account.setLoanId(loan.getId());
            accounts.add(account);

        });

        return ResponseEntity.ok(repository.saveAll(accounts));

    }

    @GetMapping("/accounts/generate")
    public ResponseEntity<String> generateAccountNumbers(){
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
    public ResponseEntity<String> fixRepayments(){
        List<LoanApplication> loanApplications = applicationRepository.findAll();
        loanApplications.forEach(application -> {
            List<LoanRepayment> repayments = createRepayments(application, application.getTenorApproved() * 4);
            repaymentRepository.saveAll(repayments);
        });

        return ResponseEntity.ok("Succeeded");
    }

    private List<LoanRepayment> createRepayments(LoanApplication loanApplication, int numOfRepayments) {
        double interest = (loanApplication.getLoanProduct().getInterestRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double monitoringFee = (loanApplication.getLoanProduct().getMonitoringFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double processingFee = (loanApplication.getLoanProduct().getProcessingFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();

        double repaymentInterest = interest  / numOfRepayments;
        double repaymentMonitoringFee = monitoringFee  / numOfRepayments;
        double repaymentProcessingFee = processingFee  / numOfRepayments;
        double principal = loanApplication.getAmountApproved() / numOfRepayments;
        double repaymentTotal = repaymentInterest + repaymentMonitoringFee + repaymentProcessingFee + principal;

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
            repayment.setPrincipal(principal);
            repayment.setTotal(repaymentTotal);
            repayment.setMaturityDate(startDate);
            repayments.add(repayment);
        }

        return repayments;
    }

    @PostMapping("/update/repayment")
    public String updateRepayments(@RequestBody Long applicationId) {
        // Fetch the loan application
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Loan Application not found"));

        // Fetch the list of repayments for the loan application
        List<LoanRepayment> repayments = repaymentRepository.findLoanRepaymentsByApplicationId(applicationId);

        if (repayments.isEmpty()) {
            return "No repayments found for the given application ID";
        }

        // Start with the disbursed date
        LocalDateTime repaymentStartDate = application.getDisbursedAt();

        // Iterate over the repayments and update the maturity date
        for (LoanRepayment repayment : repayments) {
            repaymentStartDate = repaymentStartDate.plusDays(7);
            repayment.setMaturityDate(repaymentStartDate);
        }

        // Save the updated repayments
        repaymentRepository.saveAll(repayments);

        return "Repayments updated successfully";
    }





}
