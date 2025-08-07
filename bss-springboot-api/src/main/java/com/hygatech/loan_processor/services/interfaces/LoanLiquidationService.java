package com.hygatech.loan_processor.services.interfaces;

import com.hygatech.loan_processor.dtos.LoanLiquidationRequest;
import com.hygatech.loan_processor.dtos.LoanLiquidationResponse;

public interface LoanLiquidationService {
    public LoanLiquidationResponse liquidateLoan(LoanLiquidationRequest request);

}
