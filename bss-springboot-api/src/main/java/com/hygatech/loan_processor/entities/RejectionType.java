package com.hygatech.loan_processor.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RejectionType {

    TEMPORARY("TEMPORARY"),
    PERMANENT("PERMANENT");


    private final String value;

    RejectionType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() { return this.value;}

    @JsonCreator
    public static RejectionType fromValue(String value) {
        for (RejectionType result : values()) {
            if (result.value.equalsIgnoreCase(value)) {
                return result;

            }

        }

        return null;
    }
}
