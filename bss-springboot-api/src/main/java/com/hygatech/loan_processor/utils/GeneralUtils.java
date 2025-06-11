package com.hygatech.loan_processor.utils;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class GeneralUtils {
    private static final AtomicLong sequence = new AtomicLong(System.currentTimeMillis() % 100000);
    public static String generateTransactionNumber() {
        long timestamp = System.currentTimeMillis() % 10000000000L; // Get last 10 digits of the timestamp
        long seq = sequence.getAndIncrement() % 100000; // Limit sequence to 5 digits
        return String.format("%010d%05d", timestamp, seq);
    }
}
