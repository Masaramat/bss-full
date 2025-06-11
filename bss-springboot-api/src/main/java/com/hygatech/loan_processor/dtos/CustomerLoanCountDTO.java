package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class CustomerLoanCountDTO {
    private Customer customer;
    private Long loanCount;
    private Double percent;
}

