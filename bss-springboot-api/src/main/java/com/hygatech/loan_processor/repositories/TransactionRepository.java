package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.Account;
import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {
    Optional<Transaction> findFirstByAccountIdAndAmountGreaterThanOrderByIdAsc(Long trxId, Double amount);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account = :account AND t.amount > 0 AND t.trxDate >= :trxDate")
    Double findSumOfDepositsByAccountIdAndTrxDateGreaterThanEqual(
            @Param("account") Account account,
            @Param("trxDate") LocalDateTime trxDate);
}
