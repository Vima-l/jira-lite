package com.vimal.bugtracker.task;

import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UnverifiedUserCleanupTask {

    private final UserRepository userRepository;

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void removeExpiredUnverifiedUsers() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<User> expiredUsers = userRepository.findByIsVerifiedFalseAndOtpGeneratedAtBefore(cutoff);

        if (!expiredUsers.isEmpty()) {
            userRepository.deleteAll(expiredUsers);
            System.out.println("Deleted " + expiredUsers.size() + " expired unverified users.");
        }
    }
}
