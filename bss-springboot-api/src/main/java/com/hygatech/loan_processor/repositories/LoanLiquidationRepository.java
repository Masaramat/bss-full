package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.LoanLiquidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanLiquidationRepository extends JpaRepository<LoanLiquidation, Long> {
    LoanLiquidation findByLoanApplicationId(Long id);
}
