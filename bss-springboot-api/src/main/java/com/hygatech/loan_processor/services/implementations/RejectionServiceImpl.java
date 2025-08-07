package com.hygatech.loan_processor.services.implementations;

import com.hygatech.loan_processor.dtos.RejectionRequest;
import com.hygatech.loan_processor.dtos.RejectionResponse;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.LoanApplicationRepository;
import com.hygatech.loan_processor.repositories.RejectionRepository;
import com.hygatech.loan_processor.repositories.UserRepository;
import com.hygatech.loan_processor.services.helpers.ObjectValidator;
import com.hygatech.loan_processor.services.interfaces.RejectionService;
import com.hygatech.loan_processor.utils.mappers.RejectionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.hygatech.loan_processor.utils.RequestContext.getUsername;

@Service
@RequiredArgsConstructor
@Slf4j
public class RejectionServiceImpl implements RejectionService {
    private final RejectionRepository rejectionRepository;
    private final RejectionMapper rejectionMapper;
    private final ObjectValidator objectValidator;
    private final LoanApplicationRepository loanApplicationRepository;
    private final UserRepository userRepository;


    @Override
    public RejectionResponse reject(RejectionRequest rejectionRequest) {
        log.info("Rejecting loan with request: {}", rejectionRequest);
        objectValidator.validateRequest(rejectionRequest);
        LoanApplication loanApplication = getLoanApplicationById(rejectionRequest.loanId());
        log.info("Found loan application: {}", loanApplication);
        if (loanApplication.getStatus() != LoanStatus.PENDING && loanApplication.getStatus() != LoanStatus.APPROVED) {
            log.error("Cannot reject an active loan application with id: {}", rejectionRequest.loanId());
            throw new RuntimeException("Cannot reject an approved loan application");
        }
        log.info("Updating loan application status to REJECTED for loan id: {}", rejectionRequest.loanId());
        if(rejectionRequest.type() == RejectionType.PERMANENT){
            loanApplication.setStatus(LoanStatus.BLOCKED);
        }else {
            loanApplication.setStatus(LoanStatus.REJECTED);
        }


        User user = getUser();
        log.info("Updating loan application user: {}", user);


        var rejection = rejectionMapper.toEntity(rejectionRequest);
        rejection.setUserId(user.getId());
        log.info("Setting rejection details: {}", rejection);
        rejection = save(rejection);
        log.info("Rejection saved successfully: {}", rejection);
        return rejectionMapper.toResponse(rejection);

    }

    @Override
    public RejectionResponse getRejectionById(Long id) {
        return rejectionRepository.findById(id)
                .map(rejectionMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Rejection not found with id: " + id));
    }

    @Override
    public List<RejectionResponse> getAllRejectionsByLoanId(Long loanId) {
        return rejectionRepository.findAllByLoanApplicationId(loanId)
                .stream()
                .map(rejectionMapper::toResponse)
                .collect(Collectors.toList());
    }
     private Rejection save(Rejection rejection) {
        try {
            log.info("Saving rejection: {}", rejection);
            return rejectionRepository.save(rejection);
        } catch (Exception e) {
            log.error("Error saving rejection: {}", e.getMessage());
            throw new RuntimeException("Failed to save rejection", e);
        }
     }

     private LoanApplication getLoanApplicationById(Long loanId) {
        return loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan application not found with id: " + loanId));
    }

    private User getUser() {
        return userRepository.findByUsername(getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + getUsername()));
    }
}
