package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.LoanProductDto;
import com.hygatech.loan_processor.entities.LoanProduct;
import org.springframework.beans.BeanUtils;

public class LoanProductUtil {
    public static LoanProductDto toDto(LoanProduct product){
        LoanProductDto dto = new LoanProductDto();
        BeanUtils.copyProperties(product, dto);
        return dto;
    }

    public static LoanProduct toEntity(LoanProductDto dto){
        LoanProduct product = new LoanProduct();
        BeanUtils.copyProperties(dto, product);
        return product;
    }
}
