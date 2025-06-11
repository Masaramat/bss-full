package com.hygatech.loan_processor.repositories;

import com.hygatech.loan_processor.entities.AdasheSetup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdasheSetupRepository extends JpaRepository<AdasheSetup, Long> {
    Optional<AdasheSetup> findFirstByOrderByIdDesc();
}
