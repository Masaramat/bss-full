package com.hygatech.loan_processor.controllers;

import com.hygatech.loan_processor.dtos.GroupDto;
import com.hygatech.loan_processor.services.GroupService;
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
@RequestMapping("/api/v1/group")
@RequiredArgsConstructor
@Tag(name = "Customer groups APIs", description = "Endpoints for handling group management")
public class GroupController {
    private final GroupService service;
    @PostMapping
    @Operation(summary = "Register A Group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Group registered"),
            @ApiResponse(responseCode = "400", description = "Bad request: Failed validation"),
            @ApiResponse(responseCode = "403", description = "Data integrity violation")
    })
    public ResponseEntity<GroupDto> create(@RequestBody GroupDto groupDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(groupDto));
    }

    @GetMapping
    @Operation(summary = "get all groups")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Groups fetched")

    })
    public ResponseEntity<Stream<GroupDto>> all(){
        return ResponseEntity.ok(service.all());
    }

    @GetMapping("/{id}")
    @Operation(summary = "get all groups")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Groups fetched")

    })
    public ResponseEntity<GroupDto> find(@PathVariable Long id){
        return ResponseEntity.ok(service.find(id));
    }
}
