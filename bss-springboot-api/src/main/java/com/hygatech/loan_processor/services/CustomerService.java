package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.CustomerDto;
import com.hygatech.loan_processor.dtos.CustomerRequestDto;
import com.hygatech.loan_processor.entities.*;
import com.hygatech.loan_processor.repositories.AccountRepository;
import com.hygatech.loan_processor.repositories.CustomerRepository;
import com.hygatech.loan_processor.utils.CustomerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository repository;
    private final AccountRepository accountRepository;

    @Transactional
    public CustomerDto create(CustomerRequestDto customerDto){
        System.out.println(customerDto);
        try {
            Customer customer = CustomerUtil.getCustomer(customerDto);
            Account account = new Account();
            if (customerDto.getCustomerType() == CustomerType.SAVINGS){
                account.setName("Savings");
                account.setAccountType(AccountType.SAVINGS);

            } else if (customerDto.getCustomerType() == CustomerType.ADASHE) {
                account.setAccountType(AccountType.ADASHE);
                account.setName("Adashe");
            }

            account.setCustomer(customer);
            account.setAccountStatus(AccountStatus.ACTIVE);
            account.setBalance(BigDecimal.ZERO);
            accountRepository.save(account);

            return CustomerUtil.toDto(repository.save(customer));

        }catch (RuntimeException ex){
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Stream<CustomerDto> all(){
        return repository.findAll().stream().map(CustomerUtil::toDto);
    }

    public CustomerDto find(Long id){
        return CustomerUtil.toDto(getCustomer(id));
    }

    public CustomerDto update(CustomerDto customerDto){
        Customer updateCustomer = getCustomer(customerDto.getId());
        if (customerDto.getName() != null){
            updateCustomer.setName(customerDto.getName());
        }
        if (customerDto.getPhoneNumber() != null){
            updateCustomer.setPhoneNumber(customerDto.getPhoneNumber());
        }
        if (customerDto.getAddress() != null){
            updateCustomer.setAddress(customerDto.getAddress());
        }
        if (customerDto.getBvn() != null){
            updateCustomer.setBvn(customerDto.getBvn());
        }
        if (customerDto.getDateOfBirth() != null){
            updateCustomer.setDateOfBirth(customerDto.getDateOfBirth());
        }
        if (customerDto.getCustomerType() != null){
            updateCustomer.setCustomerType(customerDto.getCustomerType());
        }

        return CustomerUtil.toDto(repository.save(updateCustomer));
    }



    private Customer getCustomer(Long id){
        Optional<Customer> customerOptional= repository.findById(id);
        if(customerOptional.isEmpty()){
            throw new RuntimeException("Customer not found");
        }

        return customerOptional.get();
    }



}
