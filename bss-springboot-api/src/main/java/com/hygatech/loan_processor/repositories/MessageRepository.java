package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.Message;
import com.hygatech.loan_processor.entities.MessageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Optional<Message> findMessageByType(MessageType type);
}
