package com.hygatech.loan_processor.services.implementations;

import com.hygatech.loan_processor.dtos.LoanLiquidationRequest;
import com.hygatech.loan_processor.dtos.LoanLiquidationResponse;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.*;
import com.hygatech.loan_processor.services.helpers.ObjectValidator;
import com.hygatech.loan_processor.services.interfaces.LoanLiquidationService;
import com.hygatech.loan_processor.utils.mappers.LoanLiquidationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.hygatech.loan_processor.utils.RequestContext.getUsername;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanLiquidationServiceImpl implements LoanLiquidationService {

    private final LoanLiquidationRepository loanLiquidationRepository;
    private final LoanLiquidationMapper loanLiquidationMapper;
    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanRepaymentRepository loanRepaymentRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ObjectValidator objectValidator;

    @Override
    public LoanLiquidationResponse liquidateLoan(LoanLiquidationRequest request) {
        List<LoanRepayment> repaymentList = new ArrayList<>();
        log.info("Liquidating loan with request: {}", request);
        objectValidator.validateRequest(request);

        LoanApplication application = getLoanApplication(request.loanApplicationId());
        log.info("Application: {}", application);
        List<LoanRepayment> repayments = getLoanRepayments(request.loanApplicationId());
        log.info("Repayments: {}", repayments);

        BigDecimal totalPrincipal = calculateRemainingPrincipal(repayments);

        LoanLiquidation liquidation = loanLiquidationMapper.toEntity(request);
        BigDecimal totalAmount = totalPrincipal.add(request.interestCharged());
        liquidation.setAmount(totalAmount);

        Account loanAccount = getAccountLoanAccount(application.getId());
        Account savingsAccount = getSavingsAccount(application.getCustomer());

        log.info("Checking if savings account has sufficient balance for liquidation");
        if (savingsAccount.getBalance().compareTo(totalAmount) < 0) {
            throw new IllegalArgumentException("Insufficient balance in savings account for liquidation");
        }

        savingsAccount.setBalance(savingsAccount.getBalance().subtract(totalAmount));
        loanAccount.setBalance(BigDecimal.ZERO);
        loanAccount.setAccountStatus(AccountStatus.CLOSED);
        application.setStatus(LoanStatus.PAID_OFF);

        BigDecimal remainingInterestToApply = request.interestCharged();
        BigDecimal totalLoanInterest = BigDecimal.ZERO;

        for (LoanRepayment repayment : repayments) {
            BigDecimal interest = repayment.getInterest();
            BigDecimal monitoring = repayment.getMonitoringFee();
            BigDecimal processing = repayment.getProcessingFee();
            BigDecimal principal = repayment.getPrincipal();



            BigDecimal interestPaid = BigDecimal.ZERO;
            BigDecimal monitoringPaid = BigDecimal.ZERO;
            BigDecimal processingPaid = BigDecimal.ZERO;

            totalLoanInterest = totalLoanInterest.add(interest).add(monitoring).add(processing);

            if (remainingInterestToApply.compareTo(BigDecimal.ZERO) > 0) {
                interestPaid = remainingInterestToApply.min(interest);
                repayment.setInterest(interest.subtract(interestPaid));
                remainingInterestToApply = remainingInterestToApply.subtract(interestPaid);
            }

            if (remainingInterestToApply.compareTo(BigDecimal.ZERO) > 0) {
                monitoringPaid = remainingInterestToApply.min(monitoring);
                repayment.setMonitoringFee(monitoring.subtract(monitoringPaid));
                remainingInterestToApply = remainingInterestToApply.subtract(monitoringPaid);
            }

            if (remainingInterestToApply.compareTo(BigDecimal.ZERO) > 0) {
                processingPaid = remainingInterestToApply.min(processing);
                repayment.setProcessingFee(processing.subtract(processingPaid));
                remainingInterestToApply = remainingInterestToApply.subtract(processingPaid);
            }

            BigDecimal totalInterestPaid = interestPaid.add(monitoringPaid).add(processingPaid);
            repayment.setTotalInterestPaid(totalInterestPaid);

            repayment.setStatus(RepaymentStatus.PAID);
            repayment.setTotalDue(BigDecimal.ZERO);
            repayment.setTotalPaid(totalInterestPaid.add(principal));

            repaymentList.add(repayment);
        }

        User user = getUser();
        liquidation.setUserId(user.getId());
        liquidation.setLoanApplication(application);
        liquidation.setLoanAmount(application.getAmountApproved());

        loanRepaymentRepository.saveAll(repaymentList);
        accountRepository.save(savingsAccount);
        accountRepository.save(loanAccount);
        loanApplicationRepository.save(application);

        LoanLiquidation saved = loanLiquidationRepository.save(liquidation);
        return loanLiquidationMapper.toResponse(saved);
    }

    private LoanApplication getLoanApplication(Long applicationId) {
        log.info("Fetching loan application with ID: {}", applicationId);
        return loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Loan application not found with ID: " + applicationId));
    }

    private List<LoanRepayment> getLoanRepayments(Long applicationId) {
        log.info("Fetching loan repayments for application ID: {}", applicationId);
        return loanRepaymentRepository
                .findLoanRepaymentsByApplicationIdAndStatusIn(
                        applicationId, List.of(RepaymentStatus.PENDING, RepaymentStatus.DEFAULT));
    }

    private Account getAccountLoanAccount(Long loanId) {
        log.info("Fetching account for loan ID: {}", loanId);
        return accountRepository.findAccountByLoanId(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found for loan ID: " + loanId));
    }

    private Account getSavingsAccount(Customer customer) {
        return accountRepository.findAccountByAccountTypeAndCustomer(AccountType.SAVINGS, customer)
                .orElseThrow(() -> new IllegalArgumentException("Savings account not found"));
    }

    private BigDecimal calculateRemainingPrincipal(List<LoanRepayment> repayments) {
        return repayments.stream()
                .map(rep -> {
                    BigDecimal principal = rep.getPrincipal() != null ? rep.getPrincipal() : BigDecimal.ZERO;
                    BigDecimal principalPaid = (rep.getTotalPaid() != null ? rep.getTotalPaid() : BigDecimal.ZERO)
                            .subtract(rep.getTotalInterestPaid() != null ? rep.getTotalInterestPaid() : BigDecimal.ZERO);
                    return principal.subtract(principalPaid);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .max(BigDecimal.ZERO); // Ensure non-negative
    }


    private User getUser() {
        return userRepository.findByUsername(getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + getUsername()));
    }
}
