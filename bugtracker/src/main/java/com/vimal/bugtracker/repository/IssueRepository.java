package com.vimal.bugtracker.repository;

import com.vimal.bugtracker.model.Issue;
import com.vimal.bugtracker.model.Project;
import com.vimal.bugtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByProject(Project project);
    List<Issue> findByAssignedTo(User user);
}
