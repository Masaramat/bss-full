package com.hygatech.loan_processor.controllers.admin;

import com.hygatech.loan_processor.dtos.RegistrationRequest;
import com.hygatech.loan_processor.dtos.RegistrationResponse;
import com.hygatech.loan_processor.dtos.ServerResponse;
import com.hygatech.loan_processor.entities.AdasheSetup;
import com.hygatech.loan_processor.services.AdasheService;
import com.hygatech.loan_processor.services.SetupService;
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
@RequestMapping("/api/v1/admin/setup")
@Tag(name = "Admin Applications setup", description = "Endpoints application setup")
public class SetupController {

    private final SetupService service;
    private final AdasheService adasheService;

    @PostMapping("/adashe")
    @Operation(summary = "Create Adashe Setup")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Setup registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<ServerResponse> createAdasheSetup(@RequestBody AdasheSetup adasheSetup){
        ServerResponse serverResponse = service.createAdasheSetup(adasheSetup);
        return ResponseEntity.status(HttpStatus.CREATED).body(serverResponse);
    }

    @GetMapping("adashe/setup")
    @Operation(summary = "Create Adashe Setup")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Setup registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<AdasheSetup> getCurrentAdasheSetUp(){
        AdasheSetup adasheSetup = adasheService.findLatest();
        return ResponseEntity.ok(adasheSetup);
    }

    @PutMapping("adashe/setup")
    @Operation(summary = "Create Adashe Setup")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Setup Updated"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<ServerResponse> updateAdasheSetup(@RequestBody AdasheSetup adasheSetup){
        return ResponseEntity.ok(adasheService.updateAdasheSetup(adasheSetup));
    }
}
