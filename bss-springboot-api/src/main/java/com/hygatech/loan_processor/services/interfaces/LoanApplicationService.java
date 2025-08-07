package com.hygatech.loan_processor.services.interfaces;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanRepayment;
import jakarta.transaction.Transactional;

import java.util.stream.Stream;

public interface LoanApplicationService {
    @Transactional
    LoanApplicationDto create(LoanApplicationRequestDto requestDto);

    LoanApplicationDto approveLoanApplication(LoanApprovalDto approvalDto);

    LoanApplicationDto disburseLoan(LoanDisbursementDto disbursementDto);

    Stream<LoanApplicationDto> all();

    Stream<LoanRepayment> getExpectedRepayments();

    Stream<LoanRepayment> repayLoan();

    Stream<LoanApplicationDto> getPendingLoans();

    Stream<LoanRepayment> getRepaymentByLoan(Long loanId);

    LoanApplicationDto find(Long id);

    Stream<CustomerLoanCountDTO> getTopCustomersWithHighestLoans(Integer number);

    Stream<CustomerTotalApprovedDTO> getTopCustomersByTotalApproved(Integer number);

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    Stream<LoanApplication> getMostRecentApplications(Integer number);
}
