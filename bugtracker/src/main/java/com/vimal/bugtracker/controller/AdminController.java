package com.vimal.bugtracker.controller;

import com.vimal.bugtracker.dto.IssueRequest;
import com.vimal.bugtracker.dto.ProjectRequest;
import com.vimal.bugtracker.model.Issue;
import com.vimal.bugtracker.model.Project;
import com.vimal.bugtracker.model.User;
import com.vimal.bugtracker.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ Get all testers
    @GetMapping("/testers")
    public ResponseEntity<List<User>> getAllTesters() {
        return ResponseEntity.ok(adminService.getAlltesters());
    }

    // ✅ Create a new project
    @PostMapping("/projectscreate")
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request,
                                                 @RequestHeader("Authorization") String token) {
        Project created = adminService.createProject(request, token);
        return ResponseEntity.ok(created);
    }

    // ✅ Get all projects created by this admin
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjectsByAdmin(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(adminService.getProjectsByAdmin(token));
    }

    // ✅ Get all issues for a project
    @GetMapping("/getissues/{projectId}")
    public ResponseEntity<List<Issue>> getIssuesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(adminService.getIssuesByAdmin(projectId));
    }

    // ✅ Create an issue inside a project
    @PostMapping("/createissue")
    public ResponseEntity<Issue> createIssue(@RequestBody IssueRequest request) {
        Issue created = adminService.createIssue(request);
        return ResponseEntity.ok(created);
    }

}
