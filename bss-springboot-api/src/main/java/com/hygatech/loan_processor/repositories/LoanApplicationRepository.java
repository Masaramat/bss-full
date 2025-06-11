package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long>, JpaSpecificationExecutor<LoanApplication> {
    List<LoanApplication> findLoanApplicationsByStatusIn(Collection<LoanStatus> status);

    @Query("SELECT new com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO(MONTH(la.appliedAt), SUM(la.formsFee + la.searchFee)) " +
            "FROM LoanApplication la " +
            "WHERE YEAR(la.appliedAt) = :year " +
            "GROUP BY MONTH(la.appliedAt)")
    List<MonthlyRepaymentDTO> findMonthlyFeeIncomeByYear(@Param("year") int year);

    @Query("SELECT la.customer, COUNT(la) AS loanCount " +
            "FROM LoanApplication la " +
            "WHERE la.status IN (com.hygatech.loan_processor.entities.LoanStatus.ACTIVE, com.hygatech.loan_processor.entities.LoanStatus.PAID_OFF) " +
            "GROUP BY la.customer " +
            "ORDER BY loanCount DESC")
    List<Object[]> findTopCustomersWithHighestLoans(Pageable pageable);

    @Query("SELECT la.customer, SUM(la.amountApproved) AS totalApproved " +
            "FROM LoanApplication la " +
            "WHERE la.status IN (com.hygatech.loan_processor.entities.LoanStatus.ACTIVE, com.hygatech.loan_processor.entities.LoanStatus.PAID_OFF) " +
            "GROUP BY la.customer " +
            "ORDER BY totalApproved DESC")
    List<Object[]> findTopCustomersByTotalApproved(Pageable pageable);

    @Query("SELECT la FROM LoanApplication la ORDER BY la.appliedAt DESC")
    List<LoanApplication> findMostRecentApplications(Pageable pageable);

    Long countAllByStatusIn(List<LoanStatus> status);
}
