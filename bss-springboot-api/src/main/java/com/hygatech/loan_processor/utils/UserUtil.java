package com.hygatech.loan_processor.utils;

import com.hygatech.loan_processor.dtos.RegistrationRequest;
import com.hygatech.loan_processor.dtos.UserDto;
import com.hygatech.loan_processor.entities.User;
import org.springframework.beans.BeanUtils;

public class UserUtil {
    public static UserDto toDto(User user){
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        return dto;

    }

    public static User getUserEntity(RegistrationRequest request){
        User user = new User();
        BeanUtils.copyProperties(request, user);
        return user;
    }
}
