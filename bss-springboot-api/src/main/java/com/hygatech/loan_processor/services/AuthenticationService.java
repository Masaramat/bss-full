package com.hygatech.loan_processor.services;


import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.User;
import com.hygatech.loan_processor.exceptions.IncorrectPasswordException;
import com.hygatech.loan_processor.repositories.UserRepository;
import com.hygatech.loan_processor.utils.UserUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        if (request.getUsername() == null || request.getPassword() == null){
            throw new RuntimeException("Username or password not entered");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername()).orElseThrow();
        var refreshToken = jwtService.generateRefreshToken(user);
        var token = jwtService.generateToken(user);
        UserDto userDto = UserUtil.toDto(user);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, "refreshToken=" + refreshToken + "; HttpOnly; Secure; SameSite=None");

        return ResponseEntity.ok().headers(headers).body(
                AuthenticationResponse.builder()
                .userDto(userDto)
                .token(token)
                .refreshToken(refreshToken)
                .build());
    }


    public ServerResponse changePassword(ChangePasswordRequest request) {
        User user = getUser(request.getUserId());
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            throw new IncorrectPasswordException("Current password incorrect");
        }

        if (request.getPassword().length() < 6){
            throw new IncorrectPasswordException("Password too short");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        repository.save(user);
        return ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("password changed successfully")
                .timeStamp(LocalDateTime.now())
                .build();
    }


    public AuthenticationResponse refreshToken(TokenRefreshRequest tokenRefreshRequest) {
        String refreshToken = tokenRefreshRequest.getRefreshToken();
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new IncorrectPasswordException("Missing refresh token");
        }
        try {
            String username = jwtService.extractUsername(refreshToken);
            User user = repository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                String token = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);
                return AuthenticationResponse.builder()
                        .token(token)
                        .userDto(UserUtil.toDto(user))
                        .refreshToken(newRefreshToken)
                        .build();
            } else {
                throw new JwtException("Refresh token invalid");
            }
        } catch (Exception e) {
            throw new IncorrectPasswordException(e.getMessage());
        }

    }

    private User getUser(Long id){
        Optional<User> user = repository.findById(id);
        if (user.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }

        return user.get();
    }
}
