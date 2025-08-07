package com.hygatech.loan_processor.services.implementations;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.*;
import com.hygatech.loan_processor.services.TransactionService;
import com.hygatech.loan_processor.services.interfaces.LoanApplicationService;
import com.hygatech.loan_processor.utils.GeneralUtils;
import com.hygatech.loan_processor.utils.LoanApplicationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoanApplicationServiceImpl implements LoanApplicationService {
    private final LoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final LoanProductRepository productRepository;
    private final AccountRepository accountRepository;
    private final LoanRepaymentRepository repaymentRepository;
    private final TransactionService transactionService;
    private final GroupRepository groupRepository;

    @Transactional
    @Override
    public LoanApplicationDto create(LoanApplicationRequestDto requestDto) {
        String transactionNumber = GeneralUtils.generateTransactionNumber();
        try {

            LoanApplication application = LoanApplicationUtil.getLoanApplication(requestDto);

            LoanProduct product = getProduct(requestDto.getLoanProductId());
            User user = getUser(requestDto.getAppliedById());
            Customer customer = getCustomer(requestDto.getCustomerId());

            if(requestDto.getGroupId() != null) {
                validateExistingLoan(customer);

                Group group = getGroup(requestDto.getGroupId());

                application.setGroup(group);
                group.setNumberOfMembers(group.getNumberOfMembers() + 1);
            }



            application.setAppliedBy(user);
            application.setCustomer(customer);
            application.setLoanProduct(product);
            application.setAppliedAt(LocalDateTime.now());
            application.setStatus(LoanStatus.PENDING);

            //TODO: Add logic to get collateral deposit from CD Account
            BigDecimal expectedCollateralDeposit = BigDecimal.valueOf(0.1).multiply(requestDto.getAmount());
            BigDecimal actualCd;

            Account collateralDepositAccount = getCollateralDepostAccount(customer);

            if (collateralDepositAccount == null){
                collateralDepositAccount = new Account();
                collateralDepositAccount.setAccountType(AccountType.COLLATERAL_DEPOSIT);
                collateralDepositAccount.setName(AccountType.COLLATERAL_DEPOSIT.toString());
                collateralDepositAccount.setCustomer(customer);
                collateralDepositAccount.setAccountStatus(AccountStatus.ACTIVE);
                collateralDepositAccount.setBalance(requestDto.getCollateralDeposit());
                actualCd = requestDto.getCollateralDeposit();

            }else {
                collateralDepositAccount.setBalance(collateralDepositAccount.getBalance().add(requestDto.getCollateralDeposit()));
                actualCd = collateralDepositAccount.getBalance().add(requestDto.getCollateralDeposit());
            }

            if (actualCd.compareTo(expectedCollateralDeposit) < 0) {
                log.error("Collateral deposit not enough: expected {}, actual {}", expectedCollateralDeposit, actualCd);
                throw new RuntimeException("Collateral deposit not enough");
            }

            Account savedCdAccount = accountRepository.save(collateralDepositAccount);
            if(requestDto.getCollateralDeposit().compareTo(BigDecimal.ZERO) > 0){
                transactionService.createTransaction(savedCdAccount, "Collateral deposit", requestDto.getCollateralDeposit(), transactionNumber);
            }

            LoanApplication saved = repository.save(application);
            return LoanApplicationUtil.toDto(saved);

        } catch (RuntimeException ex) {
            throw new RuntimeException("Error creating loan application: " + ex.getMessage());
        }
    }

    @Override
    @Transactional
    public LoanApplicationDto approveLoanApplication(LoanApprovalDto approvalDto){
        try{
            log.info("Approval Object: {}", approvalDto);
            LoanApplication application = getLoan(approvalDto.getLoanId());

            User user = getUser(approvalDto.getUserid());

            validateExistingLoan(application.getCustomer());

            application.setApprovedAt(LocalDateTime.now());
            application.setApprovedBy(user);
            application.setAmountApproved(approvalDto.getAmountApproved());
            application.setTenorApproved(approvalDto.getTenorApproved());
            application.setAmountInWordsApproved(approvalDto.getAmountInWordsApproved());
            application.setStatus(LoanStatus.APPROVED);

            return LoanApplicationUtil.toDto(repository.save(application));

        }catch (RuntimeException ex){
            throw new RuntimeException(ex.getMessage());
        }

    }

    @Override
    @Transactional
    public LoanApplicationDto disburseLoan(LoanDisbursementDto disbursementDto) {
        String transactionNumber = GeneralUtils.generateTransactionNumber();

        LoanApplication loanApplication = getLoan(disbursementDto.getLoanId());
        User user = getUser(disbursementDto.getUserId());
        validateExistingLoan(loanApplication.getCustomer());


        BigDecimal loanRepayment = calculateLoanRepayment(loanApplication);
        int numOfRepayments = loanApplication.getTenorApproved() * 4;
        LocalDateTime maturity = calculateMaturity(numOfRepayments);

        Account savingsAccount = getSavingsAccount(loanApplication.getCustomer());
        disburseLoanToAccount(savingsAccount, loanApplication.getAmountApproved(), transactionNumber);

        int loanCycle = getNextLoanCycle(loanApplication.getCustomer());

        // Ensure loanApplication is saved before creating the loan account
        LoanApplication savedApplication = repository.save(loanApplication);

        createLoanAccount(savedApplication, loanRepayment, loanCycle, transactionNumber);

        List<LoanRepayment> repayments = createRepayments(savedApplication, numOfRepayments);
        repaymentRepository.saveAll(repayments);

        updateLoanApplicationStatus(savedApplication, user, maturity);

        return LoanApplicationUtil.toDto(savedApplication);
    }



    @Override
    @Transactional(readOnly = true)
    public Stream<LoanApplicationDto> all(){
        return repository.findAll().stream().map(LoanApplicationUtil::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Stream<LoanRepayment> getExpectedRepayments(){
        List<LoanRepayment> repayments = getDueLoanRepayments();
        return repayments.stream();
    }



    @Override
    @Transactional
    public Stream<LoanRepayment> repayLoan() {
        List<LoanRepayment> repayments = getDueLoanRepayments();
        List<LoanRepayment> updatedRepayments = new ArrayList<>();
        String transactionNumber = GeneralUtils.generateTransactionNumber();

        for (LoanRepayment loanRepayment : repayments) {

            LoanApplication application = loanRepayment.getApplication();
            Account savingsAccount = accountRepository.findAccountByAccountTypeAndCustomer(AccountType.SAVINGS, application.getCustomer())
                    .orElseThrow(() -> new RuntimeException("Savings account not found"));
            Account loanAccount = accountRepository.findAccountByLoanId(application.getId())
                    .orElseThrow(() -> new RuntimeException("Loan account not found"));

            // Calculate available payment amount (can't exceed totalDue)
            BigDecimal paymentAmount = savingsAccount.getBalance().min(loanRepayment.getTotalDue());

            if (paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
                handleDefaultCase(loanRepayment, application);
                updatedRepayments.add(loanRepayment);
                continue;
            }

            // Process payment
            processPayment(loanRepayment, application, savingsAccount, loanAccount, paymentAmount, transactionNumber);

            updatedRepayments.add(loanRepayment);
        }

        return repaymentRepository.saveAll(updatedRepayments).stream();
    }





    @Override
    @Transactional(readOnly = true)
    public Stream<LoanApplicationDto> getPendingLoans(){
        List<LoanStatus> statuses = Arrays.asList(LoanStatus.PENDING, LoanStatus.APPROVED);
        return repository.findLoanApplicationsByStatusIn(statuses).stream().map(LoanApplicationUtil::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Stream<LoanRepayment> getRepaymentByLoan(Long loanId){
        return repaymentRepository.findLoanRepaymentsByApplicationId(loanId).stream();
    }

    @Override
    @Transactional(readOnly = true)
    public LoanApplicationDto find(Long id){
        return LoanApplicationUtil.toDto(getLoan(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Stream<CustomerLoanCountDTO> getTopCustomersWithHighestLoans(Integer number) {
        List<Object[]> result = repository.findTopCustomersWithHighestLoans(PageRequest.of(0, number));
        Long totalCount = repository.countAllByStatusIn(List.of(LoanStatus.ACTIVE, LoanStatus.PAID_OFF));

        return result.stream()
                .map(row -> {
                    Customer customer = (Customer) row[0];
                    Long loanCount = (Long) row[1];
                    Double loanRatio = (loanCount.doubleValue() / totalCount.doubleValue()) * 100;
                    return new CustomerLoanCountDTO(customer, loanCount, loanRatio);
                })
                .toList().stream();
    }

    @Override
    @Transactional(readOnly = true)
    public Stream<CustomerTotalApprovedDTO> getTopCustomersByTotalApproved(Integer number) {
        List<Object[]> result = repository.findTopCustomersByTotalApproved(PageRequest.of(0, number));
        return result.stream()
                .map(row -> new CustomerTotalApprovedDTO((Customer) row[0], BigDecimal.valueOf((Double) row[1])))
                .toList().stream();
    }


    @Override
    @Transactional(readOnly = true)
    public Stream<LoanApplication> getMostRecentApplications(Integer number) {
        return repository.findMostRecentApplications(PageRequest.of(0, number)).stream();
    }

    private Customer getCustomer(Long customerId){
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty()){
            throw new RuntimeException("Customer not found");
        }

        return  customer.get();
    }
    private User getUser(Long userId){
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()){
            throw new RuntimeException("User not found");
        }

        return  user.get();
    }
    private LoanProduct getProduct(Long productId){
        Optional<LoanProduct> product = productRepository.findById(productId);
        if (product.isEmpty()){
            throw new RuntimeException("Product not found");
        }

        return  product.get();
    }

    private LoanApplication getLoan(Long id){
        Optional<LoanApplication> loanApplication = repository.findById(id);
        if (loanApplication.isEmpty()){
            throw new RuntimeException("Loan not found");
        }

        return loanApplication.get();
    }

    private Account getCollateralDepostAccount(Customer customer){
        Optional<Account> account = accountRepository.findAccountByAccountTypeAndCustomer(AccountType.COLLATERAL_DEPOSIT, customer);
        return account.orElse(null);

    }

    private void validateExistingLoan(Customer customer) {
        Optional<Account> existingAccount = accountRepository.findAccountByAccountTypeAndCustomerAndAccountStatus( AccountType.LOAN, customer, AccountStatus.ACTIVE);
        if (existingAccount.isPresent()) {
            throw new RuntimeException("Customer already has a running loan");
        }
    }
    private BigDecimal calculateLoanRepayment(LoanApplication loanApplication) {
        BigDecimal amount = loanApplication.getAmountApproved();
        BigDecimal tenor = BigDecimal.valueOf(loanApplication.getTenorApproved());

        BigDecimal interest = BigDecimal.valueOf(loanApplication.getLoanProduct().getInterestRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP) // <- added scale + rounding
                .multiply(amount)
                .multiply(tenor);

        BigDecimal monitoringFee = BigDecimal.valueOf(loanApplication.getLoanProduct().getMonitoringFeeRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .multiply(amount)
                .multiply(tenor);

        BigDecimal processingFee = BigDecimal.valueOf(loanApplication.getLoanProduct().getProcessingFeeRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .multiply(amount)
                .multiply(tenor);


        return interest.add(monitoringFee).add(processingFee).add(amount);
    }

    private LocalDateTime calculateMaturity(int numOfRepayments) {
        return LocalDateTime.now().plusWeeks(numOfRepayments);
    }
    private Account getSavingsAccount(Customer customer) {
        Optional<Account> savingsAccountOptional = accountRepository.findAccountByAccountTypeAndCustomer(AccountType.SAVINGS, customer);
        if (savingsAccountOptional.isEmpty()) {
            throw new RuntimeException("Account not found");
        }
        return savingsAccountOptional.get();
    }
    private void disburseLoanToAccount(Account account, BigDecimal amountApproved, String trxNo) {
        transactionService.createTransaction(account, "Loan disbursement", amountApproved, trxNo);
        account.setBalance(account.getBalance().add(amountApproved));
        accountRepository.save(account);
    }
    private int getNextLoanCycle(Customer customer) {
        List<Account> accountList = accountRepository.findAccountsByCustomerAndAccountType(customer, AccountType.LOAN);
        return accountList.size() + 1;
    }
    private void createLoanAccount(LoanApplication loanApplication, BigDecimal loanRepayment, int loanCycle, String trxNo) {
        Account account = new Account();
        account.setCustomer(loanApplication.getCustomer());
        account.setName(loanApplication.getLoanProduct().getName());
        account.setBalance(loanRepayment);
        account.setLoanCycle(loanCycle);
        account.setLoanId(loanApplication.getId());
        account.setAccountType(AccountType.LOAN);
        account.setAccountStatus(AccountStatus.ACTIVE);
        account = accountRepository.save(account);

        transactionService.createTransaction(account, "Loan Disbursement", loanRepayment, trxNo);
    }

    private List<LoanRepayment> createRepayments(LoanApplication loanApplication, int numOfRepayments) {
        BigDecimal amount = loanApplication.getAmountApproved();
        BigDecimal tenor = BigDecimal.valueOf(loanApplication.getTenorApproved());
        BigDecimal n = BigDecimal.valueOf(numOfRepayments);

        BigDecimal interest = BigDecimal.valueOf(loanApplication.getLoanProduct().getInterestRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP) // <- added scale + rounding
                .multiply(amount)
                .multiply(tenor);

        BigDecimal monitoringFee = BigDecimal.valueOf(loanApplication.getLoanProduct().getMonitoringFeeRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .multiply(amount)
                .multiply(tenor);

        BigDecimal processingFee = BigDecimal.valueOf(loanApplication.getLoanProduct().getProcessingFeeRate())
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .multiply(amount)
                .multiply(tenor);


        BigDecimal repaymentInterest = interest.divide(n, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentMonitoringFee = monitoringFee.divide(n, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentProcessingFee = processingFee.divide(n, 2, RoundingMode.HALF_UP);
        BigDecimal principal = amount.divide(n, 2, RoundingMode.HALF_UP);
        BigDecimal repaymentTotal = repaymentInterest.add(repaymentMonitoringFee)
                .add(repaymentProcessingFee).add(principal);

        List<LoanRepayment> repayments = new ArrayList<>();
        LocalDateTime startDate = LocalDateTime.now();

        for (int i = 0; i < numOfRepayments; i++) {
            startDate = startDate.plusDays(7);
            LoanRepayment repayment = new LoanRepayment();
            repayment.setApplication(loanApplication);
            repayment.setInterest(repaymentInterest);
            repayment.setStatus(RepaymentStatus.PENDING);
            repayment.setMonitoringFee(repaymentMonitoringFee);
            repayment.setProcessingFee(repaymentProcessingFee);
            repayment.setPrincipal(principal);
            repayment.setTotal(repaymentTotal);
            repayment.setTotalDue(repaymentTotal);
            repayment.setMaturityDate(startDate);
            repayments.add(repayment);
        }

        return repayments;
    }

    private void updateLoanApplicationStatus(LoanApplication loanApplication, User user, LocalDateTime maturity) {
        loanApplication.setStatus(LoanStatus.ACTIVE);
        loanApplication.setMaturity(maturity);
        loanApplication.setDisbursedAt(LocalDateTime.now());
        loanApplication.setDisbursedBy(user);
    }

    private List<LoanRepayment> getDueLoanRepayments() {
        List<LoanRepayment> pendingRepayments = repaymentRepository.findLoanRepaymentsByStatusAndMaturityDateIsLessThanEqual(RepaymentStatus.PENDING, LocalDateTime.now());
        List<LoanRepayment> defaultRepayments = repaymentRepository.findLoanRepaymentsByStatusAndMaturityDateIsLessThanEqual(RepaymentStatus.DEFAULT, LocalDateTime.now());
        List<LoanRepayment> repayments = new ArrayList<>();
        repayments.addAll(pendingRepayments);
        repayments.addAll(defaultRepayments);

        return repayments;
    }

    private Group getGroup(Long groupId){
        Optional<Group> group = groupRepository.findById(groupId);
        if (group.isEmpty()){
            throw new RuntimeException("Group not found");
        }

        return group.get();
    }

    private void processPayment(LoanRepayment repayment, LoanApplication application,
                                Account savingsAccount, Account loanAccount,
                                BigDecimal paymentAmount, String transactionNumber) {
        // Safely initialize all BigDecimal values
        BigDecimal totalPaid = repayment.getTotalPaid() != null ?
                repayment.getTotalPaid() : BigDecimal.ZERO;

        BigDecimal total = repayment.getTotal() != null ?
                repayment.getTotal() : BigDecimal.ZERO;

        // Calculate interest and principal portions
        BigDecimal interestPortion = calculateInterestPortion(repayment, paymentAmount);
        BigDecimal principalPortion = paymentAmount.subtract(interestPortion);

        // Update repayment tracking
        repayment.setTotalPaid(totalPaid.add(paymentAmount));
        repayment.setTotalInterestPaid(
                (repayment.getTotalInterestPaid() != null ?
                        repayment.getTotalInterestPaid() : BigDecimal.ZERO)
                        .add(interestPortion)
        );
        repayment.setTotalDue(total.subtract(totalPaid.add(paymentAmount)));

        // Update accounts (with null checks)
        BigDecimal savingsBalance = savingsAccount.getBalance() != null ?
                savingsAccount.getBalance() : BigDecimal.ZERO;
        savingsAccount.setBalance(savingsBalance.subtract(paymentAmount));

        BigDecimal loanBalance = loanAccount.getBalance() != null ?
                loanAccount.getBalance() : BigDecimal.ZERO;
        assert loanAccount.getBalance() != null;
        loanAccount.setBalance(loanAccount.getBalance().subtract(paymentAmount));

        // Record transactions
        transactionService.createTransaction(
                savingsAccount,
                "Loan repayment",
                paymentAmount.negate(),
                transactionNumber
        );

        transactionService.createTransaction(
                loanAccount,
                "Loan principal repayment",
                principalPortion.add(interestPortion).negate(),
                transactionNumber
        );

        // Update status if fully paid
        if (repayment.getTotalDue().compareTo(BigDecimal.ZERO) <= 0) {
            repayment.setStatus(RepaymentStatus.PAID);
            repayment.setPaymentDate(LocalDateTime.now());
        }

        // Check if loan is fully paid
        if (loanAccount.getBalance().compareTo(BigDecimal.ZERO) <= 0) {
            loanAccount.setAccountStatus(AccountStatus.CLOSED);
            application.setStatus(LoanStatus.PAID_OFF);
        }
    }

    private void handleDefaultCase(LoanRepayment repayment, LoanApplication application) {
        Duration overdueDuration = Duration.between(repayment.getMaturityDate(), LocalDateTime.now());
        repayment.setStatus(RepaymentStatus.DEFAULT);
        repayment.setDaysOverdue(overdueDuration.toDays());

        if (application.getMaturity().isBefore(LocalDateTime.now())) {
            Duration loanOverdueDuration = Duration.between(application.getMaturity(), LocalDateTime.now());
            application.setStatus(LoanStatus.DUE);
            application.setDaysOverdue(loanOverdueDuration.toDays());
        }
    }

    private BigDecimal calculateInterestPortion(LoanRepayment repayment, BigDecimal paymentAmount) {
        // Safely initialize all BigDecimal values with defaults if null
        BigDecimal totalInterestPaid = repayment.getTotalInterestPaid() != null ?
                repayment.getTotalInterestPaid() : BigDecimal.ZERO;

        BigDecimal interest = repayment.getInterest() != null ?
                repayment.getInterest() : BigDecimal.ZERO;

        BigDecimal monitoringFee = repayment.getMonitoringFee() != null ?
                repayment.getMonitoringFee() : BigDecimal.ZERO;

        BigDecimal processingFee = repayment.getProcessingFee() != null ?
                repayment.getProcessingFee() : BigDecimal.ZERO;

        // Calculate remaining interest obligations first
        BigDecimal remainingInterest = interest
                .add(monitoringFee)
                .add(processingFee)
                .subtract(totalInterestPaid);

        // Pay interest first (can't be negative)

        return paymentAmount.min(
                remainingInterest.max(BigDecimal.ZERO)
        );
    }

}
