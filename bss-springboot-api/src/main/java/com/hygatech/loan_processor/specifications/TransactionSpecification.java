package com.hygatech.loan_processor.specifications;

import com.hygatech.loan_processor.entities.Transaction;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class TransactionSpecification {

    private static final Logger logger = LoggerFactory.getLogger(TransactionSpecification.class);

    public static Specification<Transaction> byCriteria(String trxType, String trxBy, LocalDateTime fromDate, LocalDateTime toDate) {
        return (root, query, criteriaBuilder) -> {
            logger.info("Creating specification with trxType: {}, fromDate: {}, toDate: {}",
                    trxType, fromDate, toDate);

            Predicate predicate = criteriaBuilder.conjunction();

            if (trxType != null && !trxType.isEmpty()) {
                try {
                    if (trxType.equals("debit")) {
                        predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThan(root.get("amount"), 0));
                    } else if (trxType.equals("credit")) {
                        predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThan(root.get("amount"), 0));
                    }
                } catch (IllegalArgumentException e) {
                    logger.error("Invalid status value: {}", trxType, e);
                    throw new IllegalArgumentException("Invalid status value: " + trxType);
                }
            }
            if (trxBy != null){
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("user").get("id"), trxBy));
            }

            if (fromDate != null && toDate != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.between(root.get("trxDate"), fromDate, toDate));
            } else if (fromDate != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("trxDate"), fromDate));
            } else if (toDate != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("trxDate"), toDate));
            }

            return predicate;
        };
    }
}
