package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.ServerResponse;
import com.hygatech.loan_processor.entities.AdasheSetup;
import com.hygatech.loan_processor.repositories.AdasheSetupRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class SetupService {
    private final AdasheSetupRepository adasheSetupRepository;
    private final Validator validator;

    public ServerResponse createAdasheSetup(AdasheSetup adasheSetup){
        Set<ConstraintViolation<AdasheSetup>> violations = validator.validate(adasheSetup);
        if(!violations.isEmpty()){
            throw new ConstraintViolationException(violations);
        }

        adasheSetupRepository.save(adasheSetup);

        return ServerResponse.builder()
                .message("Setup created successfully")
                .status(HttpStatus.CREATED.value())
                .timeStamp(LocalDateTime.now())
                .build();

    }
}
