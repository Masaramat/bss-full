package com.hygatech.loan_processor.specifications;

import com.hygatech.loan_processor.entities.AdasheCommission;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class AdasheCommissionSpecifications {

    public static Specification<AdasheCommission> trxDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("trxDate"), startDate, endDate);
    }

    // You can also add more filters here, e.g., by account, amount, etc.
}
