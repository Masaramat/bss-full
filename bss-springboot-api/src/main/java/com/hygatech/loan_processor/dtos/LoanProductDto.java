package com.hygatech.loan_processor.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LoanProductDto {
    private Long id;
    private String name;
    private Double interestRate;
    private Double monitoringFeeRate;
    private Double processingFeeRate;
    private Integer tenor;
}
