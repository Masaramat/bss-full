package com.hygatech.loan_processor.services.helpers;



import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
@Slf4j
public class ObjectValidator {
    private final Validator validator;

    public <T> void validateRequest(T entity) {
        log.info("Validating entity: {}", entity);
        Set<ConstraintViolation<T>> violations = validator.validate(entity);
        if (!violations.isEmpty()) {
            log.error("Validation failed with errors: {}", violations);
            throw new ConstraintViolationException(violations);
        }

        log.info("Validation successful for entity: {}", entity);
    }
}
