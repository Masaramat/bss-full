package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CustomerTotalApprovedDTO {
    private Customer customer;
    private Double totalApproved;
}
