package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.AccountDto;
import com.hygatech.loan_processor.dtos.AccountRequestDto;
import com.hygatech.loan_processor.dtos.CustomerDto;
import com.hygatech.loan_processor.dtos.CustomerRequestDto;
import com.hygatech.loan_processor.services.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/admin/account")
@RequiredArgsConstructor
@Tag(name = "Admin Account APIs", description = "Endpoints for handling account management")
public class AccountController {
    private final AccountService service;

    @PostMapping
    @Operation(summary = "Create an account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Account created"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<AccountDto> create(@RequestBody AccountRequestDto requestDto){
        AccountDto saved = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDto> find(@PathVariable Long accountId){
        return ResponseEntity.ok(service.find(accountId));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<Stream<AccountDto>> findByCustomer(@PathVariable Long id){
        return ResponseEntity.ok(service.findByCustomer(id));
    }
}
