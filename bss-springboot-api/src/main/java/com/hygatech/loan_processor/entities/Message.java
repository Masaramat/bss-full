package com.hygatech.loan_processor.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "message", uniqueConstraints = {
        @UniqueConstraint(name = "uk_type", columnNames = "type")
})
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "message cannot be blank")
    private String message;
    @NotNull(message = "Set balance visibility")
    private Boolean showBalance;
    @NotNull(message = "You must select appropriate type")
    private MessageType type;
}
