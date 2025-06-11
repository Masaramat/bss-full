package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.Customer;
import com.hygatech.loan_processor.entities.LoanApplication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GroupDto {
    private Long id;
    private String name;
    private Integer numberOfMembers;
    private List<LoanApplication> members;
}
