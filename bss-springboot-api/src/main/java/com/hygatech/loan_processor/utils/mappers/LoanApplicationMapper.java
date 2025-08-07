package com.hygatech.loan_processor.utils.mappers;

import com.hygatech.loan_processor.dtos.LoanApplicationDto;
import com.hygatech.loan_processor.entities.LoanApplication;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring")
public interface LoanApplicationMapper {

    LoanApplication toEntity(LoanApplicationDto loanApplicationDto);

    LoanApplicationDto toDto(LoanApplication loanApplication);
}
