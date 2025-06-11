package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.CustomerDto;
import com.hygatech.loan_processor.dtos.CustomerRequestDto;
import com.hygatech.loan_processor.entities.Customer;
import org.springframework.beans.BeanUtils;

public class CustomerUtil {
    public static CustomerDto toDto(Customer customer){
        CustomerDto dto = new CustomerDto();
        BeanUtils.copyProperties(customer, dto);
        return dto;
    }

    public static Customer toEntity(CustomerDto dto){
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        return customer;
    }

    public static Customer getCustomer(CustomerRequestDto dto){
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        return customer;

    }
}
