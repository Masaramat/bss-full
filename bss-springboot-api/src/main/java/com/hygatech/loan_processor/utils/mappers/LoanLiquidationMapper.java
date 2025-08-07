package com.hygatech.loan_processor.utils.mappers;

import com.hygatech.loan_processor.dtos.LoanLiquidationRequest;
import com.hygatech.loan_processor.dtos.LoanLiquidationResponse;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanLiquidation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(
        componentModel = "spring",
        uses = {LoanApplicationMapper.class}
)
public interface LoanLiquidationMapper {

    @Mapping(source = "loanApplicationId", target = "loanApplication", qualifiedByName = "mapLoanToLiquidation")
    LoanLiquidation toEntity(LoanLiquidationRequest request);

    LoanLiquidationResponse toResponse(LoanLiquidation loanLiquidation);

    @Named("mapLoanToLiquidation")
    default LoanApplication mapLoanToLiquidation(Long loanId) {
        if (loanId == null) return null;
        LoanApplication loanApplication = new LoanApplication();
        loanApplication.setId(loanId);
        return loanApplication;
    }
}
