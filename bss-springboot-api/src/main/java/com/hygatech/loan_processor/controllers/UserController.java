package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.ChangePasswordRequest;
import com.hygatech.loan_processor.dtos.RegistrationRequest;
import com.hygatech.loan_processor.dtos.RegistrationResponse;
import com.hygatech.loan_processor.dtos.UserDto;
import com.hygatech.loan_processor.services.UserService;
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
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@Tag(name = "Admin User APIs", description = "Endpoints for handling user management by the admin")
public class UserController {
    private final UserService service;


    @GetMapping
    @Operation(summary = "Get all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "found")
    })
    public ResponseEntity<Stream<UserDto>> all(){
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found"),
            @ApiResponse(responseCode = "404", description = "Not Found")

    })
    public ResponseEntity<UserDto> find(@PathVariable Long id){

        return ResponseEntity.ok(service.find(id));
    }


    @PutMapping("/password/change")
    @Operation(summary = "Get user by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found"),
            @ApiResponse(responseCode = "404", description = "Not Found")

    })
    public ResponseEntity<UserDto> changePassword(@RequestBody ChangePasswordRequest request){

        return ResponseEntity.ok(service.changePassword(request));
    }


}
