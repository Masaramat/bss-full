package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.entities.AdasheCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdasheCommissionRepository extends JpaRepository<AdasheCommission, Long>, JpaSpecificationExecutor<AdasheCommission> {
    Optional<AdasheCommission> findFirstByAccountIdOrderByIdDesc(Long accountId);

    @Query("SELECT new com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO(MONTH(ac.trxDate), SUM(ac.amount)) FROM AdasheCommission ac " +
            "WHERE YEAR(ac.trxDate) = :year " +
            "GROUP BY MONTH(ac.trxDate)")
    List<MonthlyRepaymentDTO> findMonthlyCommissionByYear(@Param("year") int year);
}
