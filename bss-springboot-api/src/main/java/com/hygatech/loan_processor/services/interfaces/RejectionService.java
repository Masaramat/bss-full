package com.hygatech.loan_processor.services.interfaces;

import com.hygatech.loan_processor.dtos.RejectionRequest;
import com.hygatech.loan_processor.dtos.RejectionResponse;

import java.util.List;

public interface RejectionService {

    public RejectionResponse reject(RejectionRequest rejectionRequest);
    public RejectionResponse getRejectionById(Long id);

    public List<RejectionResponse> getAllRejectionsByLoanId(Long loanId);

}
