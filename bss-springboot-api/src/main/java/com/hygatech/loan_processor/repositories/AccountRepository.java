package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.entities.AccountStatus;
import com.hygatech.loan_processor.entities.AccountType;
import com.hygatech.loan_processor.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findAccountByName(String accountName);

    Optional<Account> findAccountByAccountType(AccountType accountType);

    List<Account> findAccountsByCustomerId(Long customerId);

    Optional<Account> findAccountByLoanId(Long loanId);

    List<Account> findAccountsByCustomerAndAccountType(Customer customer, AccountType accountType);

    Optional<Account> findAccountByAccountTypeAndCustomer(AccountType accountType, Customer customer);

    Optional<Account> findAccountByAccountTypeAndCustomerAndAccountStatus(AccountType accountType, Customer customer, AccountStatus status);
}
