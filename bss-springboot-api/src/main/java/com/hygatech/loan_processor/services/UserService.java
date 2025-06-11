package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.*;
import com.hygatech.loan_processor.entities.User;
import com.hygatech.loan_processor.exceptions.IncorrectPasswordException;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.UserRepository;
import com.hygatech.loan_processor.utils.UserUtil;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final Validator validator;
    private final PasswordEncoder passwordEncoder;
    public RegistrationResponse create(RegistrationRequest request){


        User user = User.builder()
                .username(request.getUsername())
                .name(request.getName())
                .email(request.getEmail())
                .role(request.getRole())
                .isEnabled(true)
                .password(passwordEncoder.encode(request.getPassword())) // Store the encoded hash
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        User savedUser = repository.save(user);

        return RegistrationResponse.builder().user(savedUser).build();
    }

    public Stream<UserDto> all(){
        return repository.findAll().stream().map(UserUtil::toDto);
    }

    public UserDto find(Long id) {
        User user = getUser(id);
        return UserUtil.toDto(user);
    }

    public UserDto update(Long id, UserDto userDto) {

        User existingUser = getUser(id);

        // Map the fields from userDto to existingUser
        if (userDto.getUsername() != null) {
            existingUser.setUsername(userDto.getUsername());
        }
        if (userDto.getName() != null) {
            existingUser.setName(userDto.getName());
        }
        if (userDto.getEmail() != null) {
            existingUser.setEmail(userDto.getEmail());
        }

        if (userDto.getIsEnabled() != null) {
            existingUser.setIsEnabled(userDto.getIsEnabled());
        }
        if (userDto.getRole() != null){
            existingUser.setRole(userDto.getRole());
        }

        Set<ConstraintViolation<User>> violations = validator.validate(existingUser);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        return UserUtil.toDto(repository.save(existingUser));
    }

    public UserDto changePassword(ChangePasswordRequest request){
        User user = getUser(request.getUserId());
        System.out.println(request);

        if(request.getCurrentPassword() != null){
            if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
                throw new IncorrectPasswordException("Password not correct");
            }

            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }else {
            throw new BadCredentialsException("Password must be provided");
        }

        return UserUtil.toDto(repository.save(user));
    }



    public void delete(Long id) {

    }

    public ServerResponse adminChangePassword(ChangePasswordRequest request) {
        if (request.getPassword() == null){
            throw new IncorrectPasswordException("Password Absent");
        }
        if (request.getPassword().length() < 6){
            throw new IncorrectPasswordException("Password too short");
        }
        User user = getUser(request.getUserId());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        repository.save(user);
        return ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Password changed successfully")
                .timeStamp(LocalDateTime.now())
                .build();
    }


    public ServerResponse disableUser(Long id) {
        User user = getUser(id);
        user.setIsEnabled(false);
        try {
            repository.save(user);
            return ServerResponse.builder()
                    .status(HttpStatus.OK.value())
                    .timeStamp(LocalDateTime.now())
                    .message("User disabled successfully")
                    .build();

        }catch (Exception ex){
            throw new RuntimeException(ex.getMessage());
        }

    }

    public ServerResponse enableUser(Long id) {
        User user = getUser(id);
        user.setIsEnabled(true);
        try {
            repository.save(user);
            return ServerResponse.builder()
                    .status(HttpStatus.OK.value())
                    .timeStamp(LocalDateTime.now())
                    .message("User disabled successfully")
                    .build();

        }catch (Exception ex){
            throw new RuntimeException(ex.getMessage());
        }
    }




    private User getUser(Long id){
        Optional<User> user = repository.findById(id);
        if(user.isEmpty()){
            throw new ObjectNotFoundException("User not found");
        }

        return user.get();
    }
}
