package com.hygatech.loan_processor.controllers.admin;


import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/user")
@Tag(name = "Admin User APIs", description = "Endpoints for handling user management by the admin")
public class AdminUserController {
    private final UserService service;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Register A user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<RegistrationResponse> create(@RequestBody RegistrationRequest userDto){
        RegistrationResponse registrationResponse = service.create(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registrationResponse);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update user by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found"),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "400", description = "Failed validation")

    })
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody UserDto userDto){
        UserDto dto = service.update(id, userDto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deleted"),
            @ApiResponse(responseCode = "404", description = "Not Found")

    })
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    @PutMapping("/change")
    @Operation(summary = "Change user password by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "404", description = "User Not Found"),
            @ApiResponse(responseCode = "400", description = "Failed validation")

    })
    public ResponseEntity<ServerResponse> changePassword(@RequestBody ChangePasswordRequest request){
        return ResponseEntity.ok(service.adminChangePassword(request));
    }

    @PutMapping("/disable/{userid}")
    public ResponseEntity<ServerResponse> disableUser(@PathVariable Long userid){
        return ResponseEntity.ok(service.disableUser(userid));
    }

    @PutMapping("/enable/{userid}")
    public ResponseEntity<ServerResponse> enableUser(@PathVariable Long userid){
        return ResponseEntity.ok(service.enableUser(userid));
    }


}
