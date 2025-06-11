package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.*;
import com.hygatech.loan_processor.utils.GeneralUtils;
import com.hygatech.loan_processor.utils.LoanApplicationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class LoanApplicationService {
    private final LoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final LoanProductRepository productRepository;
    private final AccountRepository accountRepository;
    private final LoanRepaymentRepository repaymentRepository;
    private final TransactionService transactionService;
    private final GroupRepository groupRepository;

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
            double expectedCollateralDeposit = 0.1 * requestDto.getAmount();
            double actualCd;

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
                collateralDepositAccount.setBalance(collateralDepositAccount.getBalance() + requestDto.getCollateralDeposit());
                actualCd = collateralDepositAccount.getBalance() + requestDto.getCollateralDeposit();
            }

            if (actualCd < expectedCollateralDeposit){
                throw new RuntimeException("Collateral deposit not enough");
            }

            Account savedCdAccount = accountRepository.save(collateralDepositAccount);
            if(requestDto.getCollateralDeposit() > 0){
                transactionService.createTransaction(savedCdAccount, "Collateral deposit", requestDto.getCollateralDeposit(), transactionNumber);
            }

            LoanApplication saved = repository.save(application);
            return LoanApplicationUtil.toDto(saved);

        } catch (RuntimeException ex) {
            throw new RuntimeException("Error creating loan application: " + ex.getMessage());
        }
    }

    public LoanApplicationDto approveLoanApplication(LoanApprovalDto approvalDto){
        try{
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

    public LoanApplicationDto disburseLoan(LoanDisbursementDto disbursementDto) {
        String transactionNumber = GeneralUtils.generateTransactionNumber();

        LoanApplication loanApplication = getLoan(disbursementDto.getLoanId());
        User user = getUser(disbursementDto.getUserId());
        validateExistingLoan(loanApplication.getCustomer());


        double loanRepayment = calculateLoanRepayment(loanApplication);
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



    public Stream<LoanApplicationDto> all(){
        return repository.findAll().stream().map(LoanApplicationUtil::toDto);
    }

    public Stream<LoanRepayment> getExpectedRepayments(){
        List<LoanRepayment> repayments = getDueLoanRepayments();
        return repayments.stream();
    }



    public Stream<LoanRepayment> repayLoan() {
        List<LoanRepayment> repayments = getDueLoanRepayments();

        List<LoanRepayment> updatedRepayments = new ArrayList<>();

        for (LoanRepayment loanRepayment : repayments) {
            String transactionNumber = GeneralUtils.generateTransactionNumber();
            LoanApplication application = loanRepayment.getApplication();
            Optional<Account> savingsAccountOptional = accountRepository.findAccountByAccountTypeAndCustomer(AccountType.SAVINGS, application.getCustomer());
            if (savingsAccountOptional.isEmpty()) {
                throw new RuntimeException("Account not found");
            }
            Account savingsAccount = savingsAccountOptional.get();

            Optional<Account> loanAccountOptional = accountRepository.findAccountByLoanId(application.getId());
            if (loanAccountOptional.isEmpty()) {
                throw new RuntimeException("Loan Account not found");
            }
            Account loanAccount = loanAccountOptional.get();

            if (loanRepayment.getTotal() > savingsAccount.getBalance()) {
                Duration duration = Duration.between(loanRepayment.getMaturityDate(), LocalDateTime.now());
                if (savingsAccount.getBalance() > 0) {
                    loanAccount.setBalance(loanAccount.getBalance() - savingsAccount.getBalance());
                    loanRepayment.setTotal(loanRepayment.getTotal() - savingsAccount.getBalance());
                    transactionService.createTransaction(savingsAccount, "Loan repayment", -savingsAccount.getBalance(), transactionNumber);
                    transactionService.createTransaction(loanAccount, "Loan repayment", -savingsAccount.getBalance(), transactionNumber);
                    savingsAccount.setBalance(0.00);

                }
                loanRepayment.setStatus(RepaymentStatus.DEFAULT);
                loanRepayment.setDaysOverdue(duration.toDays());
                if(application.getMaturity().isBefore(LocalDateTime.now())){
                    Duration duration1 = Duration.between(application.getMaturity(), LocalDateTime.now());
                    application.setStatus(LoanStatus.DUE);
                    application.setDaysOverdue(duration1.toDays());
                }
            } else {
                loanAccount.setBalance(loanAccount.getBalance() - loanRepayment.getTotal());
                loanRepayment.setStatus(RepaymentStatus.PAID);
                loanRepayment.setPaymentDate(LocalDateTime.now());
                savingsAccount.setBalance(savingsAccount.getBalance() - loanRepayment.getTotal());
                transactionService.createTransaction(savingsAccount, "Loan repayment", -loanRepayment.getTotal(), transactionNumber);
                transactionService.createTransaction(loanAccount, "Loan repayment", -loanRepayment.getTotal(), transactionNumber);

                if (loanAccount.getBalance() <= 1) {
                    loanAccount.setBalance(0.00);
                    loanAccount.setAccountStatus(AccountStatus.CLOSED);
                    application.setStatus(LoanStatus.PAID_OFF);
                }
            }

            repository.save(application);
            accountRepository.save(loanAccount);
            accountRepository.save(savingsAccount);
            updatedRepayments.add(loanRepayment);
        }

        List<LoanRepayment> finalRepayments = repaymentRepository.saveAll(updatedRepayments);
        return finalRepayments.stream();
    }

    public Stream<LoanApplicationDto> getPendingLoans(){
        List<LoanStatus> statuses = Arrays.asList(LoanStatus.PENDING, LoanStatus.APPROVED);
        return repository.findLoanApplicationsByStatusIn(statuses).stream().map(LoanApplicationUtil::toDto);
    }

    public Stream<LoanRepayment> getRepaymentByLoan(Long loanId){
        return repaymentRepository.findLoanRepaymentsByApplicationId(loanId).stream();
    }

    public LoanApplicationDto find(Long id){
        return LoanApplicationUtil.toDto(getLoan(id));
    }

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

    public Stream<CustomerTotalApprovedDTO> getTopCustomersByTotalApproved(Integer number) {
        List<Object[]> result = repository.findTopCustomersByTotalApproved(PageRequest.of(0, number));
        return result.stream()
                .map(row -> new CustomerTotalApprovedDTO((Customer) row[0], (Double) row[1]))
                .toList().stream();
    }

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
    private double calculateLoanRepayment(LoanApplication loanApplication) {
        double interest = (loanApplication.getLoanProduct().getInterestRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double monitoringFee = (loanApplication.getLoanProduct().getMonitoringFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double processingFee = (loanApplication.getLoanProduct().getProcessingFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();

        return interest + monitoringFee + processingFee + loanApplication.getAmountApproved();
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
    private void disburseLoanToAccount(Account account, double amountApproved, String trxNo) {
        transactionService.createTransaction(account, "Loan disbursement", amountApproved, trxNo);
        account.setBalance(account.getBalance() + amountApproved);
        accountRepository.save(account);
    }
    private int getNextLoanCycle(Customer customer) {
        List<Account> accountList = accountRepository.findAccountsByCustomerAndAccountType(customer, AccountType.LOAN);
        return accountList.size() + 1;
    }
    private void createLoanAccount(LoanApplication loanApplication, double loanRepayment, int loanCycle, String trxNo) {
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
        double interest = (loanApplication.getLoanProduct().getInterestRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double monitoringFee = (loanApplication.getLoanProduct().getMonitoringFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();
        double processingFee = (loanApplication.getLoanProduct().getProcessingFeeRate() / 100) * loanApplication.getAmountApproved() * loanApplication.getTenorApproved();

        double repaymentInterest = interest  / numOfRepayments;
        double repaymentMonitoringFee = monitoringFee  / numOfRepayments;
        double repaymentProcessingFee = processingFee  / numOfRepayments;
        double principal = loanApplication.getAmountApproved() / numOfRepayments;
        double repaymentTotal = repaymentInterest + repaymentMonitoringFee + repaymentProcessingFee + principal;

        List<LoanRepayment> repayments = new ArrayList<>();
        LocalDateTime startDate = LocalDateTime.now();

        for (int i = 0; i < numOfRepayments; i++) {
            startDate = startDate.plusWeeks(1);
            LoanRepayment repayment = new LoanRepayment();
            repayment.setApplication(loanApplication);
            repayment.setInterest(repaymentInterest);
            repayment.setStatus(RepaymentStatus.PENDING);
            repayment.setMonitoringFee(repaymentMonitoringFee);
            repayment.setProcessingFee(repaymentProcessingFee);
            repayment.setPrincipal(principal);
            repayment.setTotal(repaymentTotal);
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
            throw new RuntimeException("Group nt found");
        }

        return group.get();
    }

}
