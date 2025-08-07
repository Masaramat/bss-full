package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.LoanApplication;
import com.hygatech.loan_processor.entities.LoanRepayment;
import com.hygatech.loan_processor.services.implementations.LoanApplicationServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/loan-application")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Customer Loans APIs", description = "Endpoints for handling group management")
public class LoanApplicationController {
    private final LoanApplicationServiceImpl service;

    @PostMapping
    @Operation(summary = "Create A Loan application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Loan applied"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<LoanApplicationDto> create(@RequestBody LoanApplicationRequestDto applicationDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(applicationDto));
    }

    @PutMapping("/approve")
    @Operation(summary = "Approve A Loan application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Loan approved"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<LoanApplicationDto> approveLoanApplication(@RequestBody LoanApprovalDto approvalDto){
        log.info("Approval Object: {}", approvalDto);
        return ResponseEntity.ok(service.approveLoanApplication(approvalDto));
    }

    @PutMapping("disburse")
    @Operation(summary = "Disburse A Loan application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Loan approved"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<LoanApplicationDto> disburseLoan(@RequestBody LoanDisbursementDto loanDisbursementDto){
        return ResponseEntity.ok(service.disburseLoan(loanDisbursementDto));
    }

    @GetMapping
    @Operation(summary = "get all loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<LoanApplicationDto>> all(){
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    @Operation(summary = "get all loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<LoanApplicationDto> find(@PathVariable Long id){
        return ResponseEntity.ok(service.find(id));
    }

    @GetMapping("/pending")
    @Operation(summary = "get all pending loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<LoanApplicationDto>> getPending(){
        return ResponseEntity.ok(service.getPendingLoans());
    }

    @GetMapping("/repayments/{loanId}")
    @Operation(summary = "get all pending loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<LoanRepayment>> getRepaymentsByLoan(@PathVariable Long loanId){
        return ResponseEntity.ok(service.getRepaymentByLoan(loanId));
    }


    @GetMapping("/expected")
    @Operation(summary = "get all expected loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<LoanRepayment>> getExpected(){

        return ResponseEntity.ok(service.getExpectedRepayments());
    }

    @PutMapping("/repay")
    @Operation(summary = "Pay all expected loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans repaid")

    })
    public ResponseEntity<Stream<LoanRepayment>> payExpected(){

        return ResponseEntity.ok(service.repayLoan());
    }

    @GetMapping("/top/{number}")
    @Operation(summary = "get all loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<CustomerLoanCountDTO>> topLoans(@PathVariable Integer number){
        return ResponseEntity.ok(service.getTopCustomersWithHighestLoans(number));
    }

    @GetMapping("/top/amount/{number}")
    @Operation(summary = "get all loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<CustomerTotalApprovedDTO>> topLoanAmounts(@PathVariable Integer number){
        return ResponseEntity.ok(service.getTopCustomersByTotalApproved(number));
    }

    @GetMapping("/recent/{number}")
    @Operation(summary = "get all loans")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "loans fetched")

    })
    public ResponseEntity<Stream<LoanApplication>> getRecentLoans(@PathVariable Integer number){
        return ResponseEntity.ok(service.getMostRecentApplications(number));
    }


}
