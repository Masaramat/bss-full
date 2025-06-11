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
public class RepaymentReportRequest {

    private String status;
    private String dateType;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}
