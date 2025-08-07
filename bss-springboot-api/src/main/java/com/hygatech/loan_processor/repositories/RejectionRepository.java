package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.Rejection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RejectionRepository extends JpaRepository<Rejection, Long> {
    List<Rejection> findAllByLoanApplicationId(Long loanId);
}
