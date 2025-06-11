package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.LoanApplicationDto;
import com.hygatech.loan_processor.dtos.LoanApplicationRequestDto;
import com.hygatech.loan_processor.dtos.LoanReportResponse;
import com.hygatech.loan_processor.entities.LoanApplication;
import org.springframework.beans.BeanUtils;

public class LoanApplicationUtil {

    public static LoanApplicationDto toDto(LoanApplication application){
        LoanApplicationDto dto = new LoanApplicationDto();
        BeanUtils.copyProperties(application, dto);

        return dto;
    }

    public static LoanApplication getLoanApplication(LoanApplicationRequestDto requestDto){
        LoanApplication application = new LoanApplication();
        BeanUtils.copyProperties(requestDto, application);

        return application;
    }

    public static LoanReportResponse getReportResponse(LoanApplication application){
        LoanReportResponse response = new LoanReportResponse();
        BeanUtils.copyProperties(application, response);
        return response;
    }
}
