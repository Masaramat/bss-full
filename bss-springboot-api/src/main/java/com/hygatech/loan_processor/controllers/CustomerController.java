package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.CustomerDto;
import com.hygatech.loan_processor.dtos.CustomerRequestDto;
import com.hygatech.loan_processor.services.CustomerService;
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
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@Tag(name = "Admin customer APIs", description = "Endpoints for handling customer management")
public class CustomerController {
    private final CustomerService service;

    @PostMapping
    @Operation(summary = "Register A Customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Group registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<CustomerDto> create(@RequestBody CustomerRequestDto customerDto){
        System.out.println("Request customer from controller" + customerDto);
        CustomerDto saved = service.create(customerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    @Operation(summary = "get all customers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "2000", description = "Groups fetched")

    })
    public ResponseEntity<Stream<CustomerDto>> all(){
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    @Operation(summary = "get customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Groups fetched")

    })
    public ResponseEntity<CustomerDto> find(@PathVariable Long id){
        return ResponseEntity.ok(service.find(id));
    }


    @PutMapping()
    @Operation(summary = "Update customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Groups fetched")

    })
    public ResponseEntity<CustomerDto> find(@RequestBody CustomerDto customerDto){
        return ResponseEntity.ok(service.update(customerDto));
    }



}
