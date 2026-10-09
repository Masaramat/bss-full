package com.hygatech.loan_processor.utils.mappers;

import com.hygatech.loan_processor.dtos.TransactionResponse;
import com.hygatech.loan_processor.entities.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionResponse toResponse(Transaction transaction);
}
