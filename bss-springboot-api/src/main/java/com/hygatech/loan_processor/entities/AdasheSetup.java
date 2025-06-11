package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "adashe_setup")
public class AdasheSetup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Double commissionRate;
    @NotNull
    private Double minimumDeposit;
}
