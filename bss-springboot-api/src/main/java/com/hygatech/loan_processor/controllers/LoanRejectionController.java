package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.RejectionRequest;
import com.hygatech.loan_processor.dtos.RejectionResponse;
import com.hygatech.loan_processor.services.interfaces.RejectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rejection")
@Tag(name = "Loan Rejection API", description = "Manages Loan Rejection Endpoints")
@RequiredArgsConstructor
public class LoanRejectionController {
    private final RejectionService rejectionService;

    @PostMapping
    @Operation(summary = "Rejects a Loan")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Loan rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "403", description = "Access Denied"),
            @ApiResponse(responseCode = "404", description = "Loan not found"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public ResponseEntity<RejectionResponse> reject(
            @RequestBody @Valid RejectionRequest rejectionRequest
    ){
        return ResponseEntity.status(201).body(rejectionService.reject(rejectionRequest));
    }
    
    @GetMapping("loanApplication/{loanApplicationId}")
    @Operation(summary = "Gets Rejection Details for a Loan Application")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Rejection details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Rejection details not found for the given Loan Application ID"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public ResponseEntity<List<RejectionResponse>> getRejectionDetails(
            @PathVariable Long loanApplicationId
    ) {
        return ResponseEntity.ok(rejectionService.getAllRejectionsByLoanId(loanApplicationId));
    }

}
