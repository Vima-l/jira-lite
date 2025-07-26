package com.vimal.bugtracker.service;

import com.vimal.bugtracker.dto.IssueRequest;
import com.vimal.bugtracker.dto.ProjectRequest;
import com.vimal.bugtracker.model.Issue;
import com.vimal.bugtracker.model.Issue.IssueStatus;
import com.vimal.bugtracker.model.Project;
import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.model.User.Role;
import com.vimal.bugtracker.repository.IssueRepository;
import com.vimal.bugtracker.repository.ProjectRepository;
import com.vimal.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.vimal.bugtracker.service.JwtService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AdminService {
    private final JwtService jwtService;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;


    public List<User> getAlltesters() {
        List<User> testers = userRepository.findUserByRole(Role.TESTER);
        System.out.println("Found testers: " + testers.size());
        return testers;
    }
    public Project createProject(ProjectRequest request, String token) {
        String email=extractEmailFromToken(token);
        User admin=userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException(email));

        Project project=Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(admin)
                .build();
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByAdmin(String token){
        String username = extractEmailFromToken(token);
        User admin=userRepository.findByEmail(username)
                .orElseThrow(()->new UsernameNotFoundException(username));
        return projectRepository.findByCreatedBy(admin);
    }

    public List<Issue> getIssuesByAdmin(Long projectId){
        Project project =  projectRepository.findById(projectId)
                .orElseThrow(()->new RuntimeException("project not found"));
        return issueRepository.findByProject(project);
    }
    public Issue createIssue(IssueRequest issueRequest) {
        Project project = projectRepository.findById(issueRequest.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedTester = userRepository.findById(issueRequest.getTesterId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Issue issue = new Issue();
        issue.setTitle(issueRequest.getTitle());
        issue.setDescription(issueRequest.getDescription());
        issue.setPriority(issueRequest.getPriority());
        issue.setStatus(IssueStatus.TODO);
        issue.setAssignedTo(assignedTester);
        issue.setProject(project);

        return issueRepository.save(issue);
    }

    private String extractEmailFromToken(String token) {
        return jwtService.extractUsername(token.substring(7));
    }

}
