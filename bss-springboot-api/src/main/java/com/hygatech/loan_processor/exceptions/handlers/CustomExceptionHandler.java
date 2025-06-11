package com.hygatech.loan_processor.exceptions.handlers;

import com.hygatech.loan_processor.dtos.ServerResponse;
import com.hygatech.loan_processor.exceptions.IncorrectPasswordException;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@ControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(ObjectNotFoundException.class)
    public ResponseEntity<ServerResponse> handleObjectNotFoundException(ObjectNotFoundException ex){
        ServerResponse errors = ServerResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<ServerResponse> handleIncorrectPasswordException(IncorrectPasswordException ex){
        ServerResponse errors = ServerResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(ConstraintViolationException ex) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        Map<String, String> errors = new HashMap<>();

        for (ConstraintViolation<?> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(propertyPath, message);
        }
        System.out.println(ex.getMessage());

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ServerResponse> handleAuthenticationException(AuthenticationException ex){
        ServerResponse errors = ServerResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errors, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ServerResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex){
        ServerResponse errors = ServerResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("User already exists, check email or username")
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(errors, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        // Log the exception details
        System.err.println("An error occurred: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }



}
