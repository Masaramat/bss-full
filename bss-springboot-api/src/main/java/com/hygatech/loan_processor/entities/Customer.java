package com.hygatech.loan_processor.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "customers", uniqueConstraints = {
        @UniqueConstraint(name = "uk_bvn", columnNames = "bvn")
})
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phoneNumber;
    private String dateOfBirth;
    private Long bvn;
    private String address;
    private CustomerType customerType;

}
