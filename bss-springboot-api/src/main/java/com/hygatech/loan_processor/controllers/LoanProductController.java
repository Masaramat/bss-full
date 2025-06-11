package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.LoanProductDto;
import com.hygatech.loan_processor.services.LoanProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/admin/loan-product")
@AllArgsConstructor
@Tag(name = "Customer loan product APIs", description = "Endpoints for handling group management")
public class LoanProductController {
    private final LoanProductService service;

    @PostMapping
    @Operation(summary = "Register A Loan product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "product registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<LoanProductDto> create(@RequestBody LoanProductDto productDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(productDto));
    }
    @GetMapping
    @Operation(summary = "get all products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "products fetched")

    })
    public ResponseEntity<Stream<LoanProductDto>> all(){
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "products found")

    })
    public ResponseEntity<LoanProductDto> find(@PathVariable Long id){
        return ResponseEntity.ok(service.find(id));
    }

    @PutMapping("/update")
    @Operation(summary = "Update product by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "products found")

    })
    public ResponseEntity<LoanProductDto> update(@RequestBody LoanProductDto loanProductDto){
        return ResponseEntity.ok(service.update(loanProductDto));
    }
}
