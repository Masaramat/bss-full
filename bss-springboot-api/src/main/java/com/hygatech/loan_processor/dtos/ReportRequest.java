package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequest {
    private LoanStatus status;
    private String action;
    private Long userId;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}
