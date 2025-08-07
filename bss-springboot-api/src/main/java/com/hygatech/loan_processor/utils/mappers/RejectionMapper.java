package com.hygatech.loan_processor.utils.mappers;

import com.hygatech.loan_processor.dtos.RejectionRequest;
import com.hygatech.loan_processor.dtos.RejectionResponse;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.Rejection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface RejectionMapper {
    @Mapping(source = "loanId", target = "loanApplication", qualifiedByName = "mapLoanToRejection")
    Rejection toEntity(RejectionRequest rejectionRequest);
    RejectionResponse toResponse(Rejection rejection);

    @Named("mapLoanToRejection")
    default LoanApplication mapLoanToRejection(Long loanId) {
        if (loanId == null) {
            return null;
        }
        LoanApplication loanApplication = new LoanApplication();
        loanApplication.setId(loanId);
        return loanApplication;
    }

}
