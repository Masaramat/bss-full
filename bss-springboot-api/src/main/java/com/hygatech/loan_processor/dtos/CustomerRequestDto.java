package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.CustomerType;
import com.hygatech.loan_processor.entities.Group;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequestDto {
    private String name;
    private String phoneNumber;
    private Long bvn;
    private String address;
    private String dateOfBirth;
    private CustomerType customerType;
    private Long groupId;
}
