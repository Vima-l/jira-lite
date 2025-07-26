package com.vimal.bugtracker.service;


import com.vimal.bugtracker.model.Issue;
import com.vimal.bugtracker.model.Issue.IssueStatus;
import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.repository.IssueRepository;
import com.vimal.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TesterService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public List<Issue> getTasksByTesterId(Long testerId) {
        User tester = userRepository.findById(testerId)
                .orElseThrow(() -> new RuntimeException("Tester not found with id: " + testerId));
        return issueRepository.findByAssignedTo(tester);
    }


    public void updateTaskStatus(Long issueId, IssueStatus newStatus) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus(newStatus);
        issueRepository.save(issue);
    }

}
