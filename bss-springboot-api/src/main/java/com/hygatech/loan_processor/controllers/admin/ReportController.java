package com.hygatech.loan_processor.controllers.admin;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.entities.Transaction;
import com.hygatech.loan_processor.services.AdasheService;
import com.hygatech.loan_processor.services.LoanReportService;
import com.hygatech.loan_processor.services.TransactionReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("api/v1/report")
@RequiredArgsConstructor
public class ReportController {
    private final LoanReportService loanReportService;
    private final TransactionReportService transactionReportService;
    private final AdasheService adasheService;


    @PostMapping("/loans")
    @Operation(summary = "Finish request by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<LoanReportResponse>> searchRequests(@RequestBody ReportRequest request){
        Stream<LoanReportResponse> requests = loanReportService.findByCriteria(request);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/repayment")
    @Operation(summary = "Finish request by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<LoanRepayment>> repaymentReport(@RequestBody RepaymentReportRequest request){
        Stream<LoanRepayment> requests = loanReportService.repaymentReportByCriteria(request);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/transaction")
    @Operation(summary = "Finish request by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<TransactionDto>> transactionReport(@RequestBody TransactionReportRequest request){
        Stream<TransactionDto> requests = transactionReportService.getTransactionReport(request);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/interest")
    @Operation(summary = "Get monthly interest")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<MonthlyRepaymentDTO>> getAllMonthlyInterests(){
        Stream<MonthlyRepaymentDTO> requests = loanReportService.getMonthlyYearInterest();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/fees")
    @Operation(summary = "Get Monthly Fees")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval of monthly fees")
    })
    public ResponseEntity<Stream<MonthlyRepaymentDTO>> getAllMonthlyFees() {
        Stream<MonthlyRepaymentDTO> fees = loanReportService.getMonthlyYearFees();
        return ResponseEntity.ok(fees);
    }

    @GetMapping("/commission")
    @Operation(summary = "Get Monthly commissions ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Succeeded")
    })
    public ResponseEntity<Stream<MonthlyRepaymentDTO>> getMonthlyYearCommission(){
        Stream<MonthlyRepaymentDTO> requests = adasheService.getMonthlyYearAdasheCommission();
        return ResponseEntity.ok(requests);
    }



}
