package com.hygatech.loan_processor.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class TransactionReportRequest {
    private String trxType;
    private String trxBy;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}
