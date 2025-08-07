package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.AdasheCommissionResponse;
import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.dtos.ServerResponse;
import com.hygatech.loan_processor.entities.AdasheCommission;
import com.hygatech.loan_processor.entities.AdasheSetup;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.AdasheCommissionRepository;
import com.hygatech.loan_processor.repositories.AdasheSetupRepository;
import com.hygatech.loan_processor.specifications.AdasheCommissionSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AdasheService {
    private final AdasheCommissionRepository commissionRepository;
    private final AdasheSetupRepository setupRepository;

    public Stream<MonthlyRepaymentDTO> getMonthlyYearAdasheCommission(){
        int currentYear = LocalDateTime.now().getYear();

        return commissionRepository.findMonthlyCommissionByYear(currentYear).stream();
    }

    public AdasheSetup findLatest(){
        Optional<AdasheSetup> adasheSetup = setupRepository.findFirstByOrderByIdDesc();
        if (adasheSetup.isEmpty()){
            throw new ObjectNotFoundException("Setup not found");
        }

        return adasheSetup.get();
    }

    public ServerResponse updateAdasheSetup(AdasheSetup adasheSetup){
        Optional<AdasheSetup> updateAdasheSetupOptional = setupRepository.findById(adasheSetup.getId());
        if (updateAdasheSetupOptional.isEmpty()){
            throw new ObjectNotFoundException("Setup not found");
        }
        AdasheSetup updateAdasheSetup = updateAdasheSetupOptional.get();
        updateAdasheSetup.setMinimumDeposit(adasheSetup.getMinimumDeposit());
        updateAdasheSetup.setCommissionRate(adasheSetup.getCommissionRate());

        setupRepository.save(updateAdasheSetup);

        return ServerResponse.builder()
                .timeStamp(LocalDateTime.now())
                .message("Setup updated successfully")
                .status(HttpStatus.OK.value())
                .build();


    }

    public List<AdasheCommissionResponse> getCommissionsWithSpec(LocalDateTime startDate, LocalDateTime endDate) {
        Specification<AdasheCommission> spec = AdasheCommissionSpecifications.trxDateBetween(startDate, endDate);
        return commissionRepository.findAll(spec)
                .stream()
                .map(adasheCommission -> new AdasheCommissionResponse(
                        adasheCommission.getId(),
                        adasheCommission.getAmount(),
                        adasheCommission.getAccount(),
                        adasheCommission.getTrxId(),
                        adasheCommission.getTrxDate()))
                .toList();
    }
}
