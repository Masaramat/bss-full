package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.LoanReportResponse;
import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.dtos.RepaymentReportRequest;
import com.hygatech.loan_processor.dtos.ReportRequest;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.repositories.LoanApplicationRepository;
import com.hygatech.loan_processor.repositories.LoanRepaymentRepository;
import com.hygatech.loan_processor.specifications.LoanSpecifications;
import com.hygatech.loan_processor.specifications.RepaymentSpecification;
import com.hygatech.loan_processor.utils.LoanApplicationUtil;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.stream.Stream;

@Service
@ToString
@RequiredArgsConstructor
public class LoanReportService {
    private final LoanApplicationRepository repository;
    private final LoanRepaymentRepository repaymentRepository;

    public Stream<LoanReportResponse> findByCriteria(ReportRequest request){
        return repository.findAll(LoanSpecifications.byCriteria(
                request.getStatus(),
                request.getAction(),
                request.getUserId(),
                request.getFromDate(),
                request.getToDate()
        )).stream().map(LoanApplicationUtil::getReportResponse);

    }

    public Stream<LoanRepayment> repaymentReportByCriteria(RepaymentReportRequest request){
        return repaymentRepository.findAll(RepaymentSpecification.byCriteria(
                request.getStatus(),
                request.getDateType(),
                request.getFromDate(),
                request.getToDate()
        )).stream();
    }

    public Stream<MonthlyRepaymentDTO> getMonthlyYearInterest(){
        int currentYear = LocalDate.now().getYear();
        return repaymentRepository.findMonthlyInterestByYear(currentYear).stream();

    }

    public Stream<MonthlyRepaymentDTO> getMonthlyYearFees(){
        int currentYear = LocalDate.now().getYear();
        System.out.println("Current year: " + currentYear);
        return repository.findMonthlyFeeIncomeByYear((Integer) currentYear).stream();

    }
}
