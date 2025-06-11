package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.services.AuthenticationService;
import com.hygatech.loan_processor.services.TokenBlacklistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Endpoints", description = "Endpoints for handling user authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final TokenBlacklistService tokenBlacklistService;


    @PostMapping("/login")
    @Operation(summary = "User login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation")
    })
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        return service.authenticate(request);
    }

    @PutMapping("/password")
    @Operation(summary = "Change Password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation")
    })
    public ResponseEntity<ServerResponse> changePassword(@RequestBody ChangePasswordRequest request){
        return ResponseEntity.ok(service.changePassword(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(service.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid authorization header");
        }

        String token = authorizationHeader.substring(7);
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }


}
