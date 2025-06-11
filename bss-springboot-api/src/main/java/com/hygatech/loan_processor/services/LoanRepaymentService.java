package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.entities.RepaymentStatus;
import com.hygatech.loan_processor.repositories.LoanRepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class LoanRepaymentService {
    private final LoanRepaymentRepository repository;

    public Stream<MonthlyRepaymentDTO> getMonthlyPaidRepaymentsForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        return repository.findMonthlyRepaymentsByStatusAndYear(RepaymentStatus.PAID, currentYear).stream();
    }

    public Stream<MonthlyRepaymentDTO> getMonthlyRepaymentsForCurrentYear() {
        int currentYear = LocalDate.now().getYear();
        return repository.findMonthlyRepaymentsByYear(currentYear).stream();
    }
}
