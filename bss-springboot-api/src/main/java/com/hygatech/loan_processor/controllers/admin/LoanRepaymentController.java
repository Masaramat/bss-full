package com.hygatech.loan_processor.controllers.admin;

import com.hygatech.loan_processor.dtos.LoanReportResponse;
import com.hygatech.loan_processor.dtos.MonthlyRepaymentDTO;
import com.hygatech.loan_processor.dtos.ReportRequest;
import com.hygatech.loan_processor.services.LoanRepaymentService;
import com.hygatech.loan_processor.services.LoanReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/repayment")
@Tag(name = "Loan Repayment APIs", description = "Endpoints for loan repayments")
@RequiredArgsConstructor
public class LoanRepaymentController {
    private final LoanRepaymentService service;

    @GetMapping("/paid")
    @Operation(summary = "Get paid loans monthly")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<MonthlyRepaymentDTO>> GetPaidMonthlyRepayments(){
        Stream<MonthlyRepaymentDTO> requests = service.getMonthlyPaidRepaymentsForCurrentYear();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/all")
    @Operation(summary = "Get paid loans monthly")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<MonthlyRepaymentDTO>> getAllMonthlyRepayments(){
        Stream<MonthlyRepaymentDTO> requests = service.getMonthlyRepaymentsForCurrentYear();
        return ResponseEntity.ok(requests);
    }



}
