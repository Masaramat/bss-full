package com.hygatech.loan_processor.specifications;

import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.entities.RepaymentStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

public class RepaymentSpecification {

    private static final Logger logger = LoggerFactory.getLogger(RepaymentSpecification.class);

    public static Specification<LoanRepayment> byCriteria(String status, String dateType, LocalDateTime fromDate, LocalDateTime toDate) {
        return (root, query, criteriaBuilder) -> {
            logger.info("Creating specification with status: {}, dateType: {}, fromDate: {}, toDate: {}",
                    status, dateType, fromDate, toDate);

            Predicate predicate = criteriaBuilder.conjunction();

            if (status != null && !status.isEmpty()) {
                try {
                    RepaymentStatus repaymentStatus = RepaymentStatus.valueOf(status.toUpperCase());
                    predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), repaymentStatus));
                    logger.info("Added status predicate: {}", status);
                } catch (IllegalArgumentException e) {
                    logger.error("Invalid status value: {}", status, e);
                    throw new IllegalArgumentException("Invalid status value: " + status);
                }
            }

            if (fromDate != null && toDate != null) {
                String dateField = "maturityDate"; // Default to maturityDate

                if ("payment".equalsIgnoreCase(dateType)) {
                    dateField = "paymentDate";
                }

                predicate = criteriaBuilder.and(predicate, criteriaBuilder.between(root.get(dateField), fromDate, toDate));
                logger.info("Added date predicate: {} between {} and {}", dateField, fromDate, toDate);
            }

            return predicate;
        };
    }

}
