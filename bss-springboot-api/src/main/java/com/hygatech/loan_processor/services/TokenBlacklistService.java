package com.hygatech.loan_processor.services;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
@Component
public class TokenBlacklistService {
    private final Set<String> blacklistedTokens = new HashSet<>();

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
