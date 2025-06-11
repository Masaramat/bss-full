package com.hygatech.loan_processor.controllers.admin;

import com.hygatech.loan_processor.entities.Message;
import com.hygatech.loan_processor.entities.MessageType;
import com.hygatech.loan_processor.services.MessageService;
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
@RequestMapping("/api/v1/admin/message")
@Tag(name = "Admin Message APIs", description = "Endpoints for handling messages management by the admin")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService service;


    @Operation(summary = "Create A Message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    @PostMapping
    public ResponseEntity<Message> create(@RequestBody Message message){
        Message message1 = service.create(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(message1);
    }

    @Operation(summary = "Get all messages")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched")

    })
    @GetMapping
    public ResponseEntity<Stream<Message>> all(){
        return ResponseEntity.ok(service.all());
    }

    @Operation(summary = "Get message by type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched")

    })
    @GetMapping("/type/{type}")
    public ResponseEntity<Message> findByType(@PathVariable MessageType type){
        return ResponseEntity.ok(service.findByType(type));
    }
}
