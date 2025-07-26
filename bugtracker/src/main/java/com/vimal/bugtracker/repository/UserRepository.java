package com.vimal.bugtracker.repository;

import com.vimal.bugtracker.model.User.Role;
import com.vimal.bugtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    List<User> findByIsVerifiedFalseAndOtpGeneratedAtBefore(LocalDateTime cutoff);

    List<User> findUserByRole(Role role);
}
