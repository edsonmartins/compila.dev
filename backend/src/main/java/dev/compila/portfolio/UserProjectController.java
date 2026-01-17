package dev.compila.portfolio;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.portfolio.dto.UserProjectRequest;
import dev.compila.portfolio.dto.UserProjectResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/portfolio")
@CrossOrigin(origins = "*")
public class UserProjectController {

    private final UserProjectService userProjectService;

    public UserProjectController(UserProjectService userProjectService) {
        this.userProjectService = userProjectService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<UserProjectResponse>> getPublicProjects(@PathVariable String username) {
        return ResponseEntity.ok(userProjectService.getPublicProjectsByUsername(username));
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<UserProjectResponse> getProjectById(@PathVariable UUID projectId) {
        return ResponseEntity.ok(userProjectService.getProject(projectId));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserProjectResponse>> getMyProjects(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userProjectService.getProjectsForUser(userDetails.getId()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProjectResponse> createProject(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UserProjectRequest request
    ) {
        return ResponseEntity.ok(userProjectService.createProject(userDetails.getId(), request));
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProjectResponse> updateProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UserProjectRequest request
    ) {
        return ResponseEntity.ok(userProjectService.updateProject(projectId, userDetails.getId(), request));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        userProjectService.deleteProject(projectId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
