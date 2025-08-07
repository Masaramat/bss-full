package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.UserDto;
import com.hygatech.loan_processor.entities.User;
import com.hygatech.loan_processor.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
public class RequestContext {

    public static String getUsername() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getName)
                .orElse("SYSTEM");
    }


}