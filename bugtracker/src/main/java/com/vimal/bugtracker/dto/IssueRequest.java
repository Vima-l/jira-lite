package com.vimal.bugtracker.dto;


import lombok.Data;
import com.vimal.bugtracker.model.Issue.Priority;

@Data
public class IssueRequest {
    private String title;
    private String description;
    private Priority priority; // Or use enum
    private Long testerId;
    private Long projectId;


}

