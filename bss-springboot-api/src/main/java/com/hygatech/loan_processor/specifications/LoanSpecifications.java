package com.hygatech.loan_processor.specifications;

import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class LoanSpecifications {

    private static final Map<String, String> actionFieldMap = new HashMap<>();

    static {
        actionFieldMap.put("applied", "appliedBy");
        actionFieldMap.put("approved", "approvedById");
        actionFieldMap.put("disbursed", "disbursedById");
    }

    public static Specification<LoanApplication> byCriteria(LoanStatus status, String action, Long userId, LocalDateTime fromDate, LocalDateTime toDate) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (status != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), status));
            }

            if (action != null && userId != null) {
                String field = actionFieldMap.get(action);
                if (field != null) {
                    predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(field), userId));
                }
            }

            if (fromDate != null && toDate != null) {
                String dateField = action + "At";
                if (action == null){
                    dateField = "appliedAt";
                }
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.between(root.get(dateField), fromDate, toDate));
            }

            return predicate;
        };
    }
}
