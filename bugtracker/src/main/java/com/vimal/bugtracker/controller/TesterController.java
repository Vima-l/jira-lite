package com.vimal.bugtracker.controller;


import com.vimal.bugtracker.model.Issue;
import com.vimal.bugtracker.model.Issue.IssueStatus;
import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.repository.UserRepository;
import com.vimal.bugtracker.service.JwtService;
import com.vimal.bugtracker.service.TesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tester")
@RequiredArgsConstructor
public class TesterController {

    private final TesterService testerService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping("/tasks")
    public ResponseEntity<List<Issue>> getTasks(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        String email = jwtService.extractUsername(token); // extract from JWT
        Optional<User> user = userRepository.findByEmail(email);
        return ResponseEntity.ok(testerService.getTasksByTesterId(user.get().getId()));
    }

    @PutMapping("/changestatus/{issueId}")
    public ResponseEntity<String> updateTaskStatus(
            @PathVariable Long issueId,
            @RequestParam("status") IssueStatus newStatus
    ) {
        testerService.updateTaskStatus(issueId, newStatus);
        return ResponseEntity.ok("Status updated successfully.");
    }
}
