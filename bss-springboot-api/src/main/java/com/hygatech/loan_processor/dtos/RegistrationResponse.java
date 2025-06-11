package com.hygatech.loan_processor.dtos;

import com.hygatech.loan_processor.entities.User;
import lombok.*;

@Builder
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationResponse {
    User user;

}
