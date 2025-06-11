package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.entities.Message;
import com.hygatech.loan_processor.entities.MessageType;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.MessageRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repository;

    private final Validator validator;

    public Message create(Message message){
        Set<ConstraintViolation<Message>> violations = validator.validate(message);
        if(!violations.isEmpty()){
            throw new ConstraintViolationException(violations);
        }

        return repository.save(message);
    }

    public Stream<Message> all(){
        return repository.findAll().stream();
    }

    public Message findByType(MessageType type){
        Optional<Message> messageOptional = repository.findMessageByType(type);

        if (messageOptional.isEmpty()){
            throw new ObjectNotFoundException("Invalid message");
        }

        return messageOptional.get();
    }
}
