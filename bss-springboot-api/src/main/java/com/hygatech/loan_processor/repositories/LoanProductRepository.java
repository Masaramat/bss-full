package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanProductRepository extends JpaRepository<LoanProduct, Long> {
}
