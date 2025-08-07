package com.hygatech.loan_processor.controllers.admin;

import com.hygatech.loan_processor.dtos.LoanLiquidationRequest;
import com.hygatech.loan_processor.dtos.LoanLiquidationResponse;
import com.hygatech.loan_processor.services.interfaces.LoanLiquidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/loan-liquidation")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Loan Liquidation APIs", description = "Endpoints for handling loan liquidation by the admin")
public class LoanLiquidationController {
    private final LoanLiquidationService loanLiquidationService;

    @PostMapping
    @Operation(summary = "Liquidate Loan")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Loan liquidated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Access denied: User does not have permission to liquidate loans"),
            @ApiResponse(responseCode = "404", description = "Loan not found")
    })
    public ResponseEntity<LoanLiquidationResponse> liquidate(
            @RequestBody @Valid LoanLiquidationRequest loanLiquidationRequest
    ){
        log.info("Liquidating loan with request: {}", loanLiquidationRequest);
        LoanLiquidationResponse response = loanLiquidationService.liquidateLoan(loanLiquidationRequest);
        return ResponseEntity.ok(response);
    }
}
