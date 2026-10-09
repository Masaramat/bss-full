package com.hygatech.loan_processor.seeders;

import com.hygatech.loan_processor.entities.Role;
import com.hygatech.loan_processor.entities.User;
import com.hygatech.loan_processor.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .name("Admin User")
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .isEnabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created");
        }

        // Seed Regular User
        if (userRepository.findByUsername("user").isEmpty()) {
            User user = User.builder()
                    .name("Regular User")
                    .username("user")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.USER)
                    .isEnabled(true)
                    .build();
            userRepository.save(user);
            System.out.println("Regular user created");
        }
    }
}