package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.entities.RepaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoanRepaymentRepository extends JpaRepository<LoanRepayment, Long>, JpaSpecificationExecutor<LoanRepayment> {

    List<LoanRepayment> findLoanRepaymentsByApplicationId(Long applicationId);
    List<LoanRepayment> findLoanRepaymentsByStatusAndMaturityDateIsLessThanEqual(RepaymentStatus status, LocalDateTime dateTime);

    @Query("SELECT new com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO(MONTH(lr.maturityDate), SUM(lr.total)) " +
            "FROM LoanRepayment lr " +
            "WHERE lr.status = :status AND YEAR(lr.maturityDate) = :year " +
            "GROUP BY MONTH(lr.maturityDate)")
    List<MonthlyRepaymentDTO> findMonthlyRepaymentsByStatusAndYear(@Param("status") RepaymentStatus status, @Param("year") int year);

    @Query("SELECT new com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO(MONTH(lr.maturityDate), SUM(lr.total)) FROM LoanRepayment lr " +
            "WHERE YEAR(lr.maturityDate) = :year " +
            "GROUP BY MONTH(lr.maturityDate)")
    List<MonthlyRepaymentDTO> findMonthlyRepaymentsByYear(@Param("year") int year);


    @Query("SELECT new com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO(MONTH(lr.paymentDate), SUM(lr.interest + lr.monitoringFee + lr.processingFee)) FROM LoanRepayment lr " +
            "WHERE YEAR(lr.paymentDate) = :year " +
            "GROUP BY MONTH(lr.paymentDate)")
    List<MonthlyRepaymentDTO> findMonthlyInterestByYear(@Param("year") int year);

}
