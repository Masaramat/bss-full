package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.LoanProductDto;
import com.hygatech.loan_processor.dtos.TransactionDto;
import com.hygatech.loan_processor.entities.Transaction;
import com.hygatech.loan_processor.services.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/v1/transaction")
@RequiredArgsConstructor
@Tag(name = "Transactions API", description = "Endpoints for handling transactions")
public class TransactionController {
    private final TransactionService service;

    @PostMapping
    @Operation(summary = "Create transaction")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transaction Created"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<Transaction> create(@RequestBody TransactionDto transactionDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(transactionDto));
    }

    @PostMapping("/send-sms")
    public ResponseEntity<String> sendSms(@RequestParam String message, @RequestParam String recipient) {
        RestTemplate restTemplate = new RestTemplate();

        String SLING_API_URL = "https://app.sling.com.ng/api/v1/send-sms";
        String API_TOKEN = "sling_l23wsmwyfrbi78wjtqfjufmw7e7ykkpdc4oekgve7dv6qnkzvrun3s";
        String url = SLING_API_URL + "?api_token=" + API_TOKEN + "&to=" + recipient + "&message=" + message + "&sender=BorrowSS";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Authorization", "Bearer " + API_TOKEN);

        HttpEntity<String> entity = new HttpEntity<>(headers);

//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return null;
    }
}
