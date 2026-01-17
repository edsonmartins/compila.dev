package dev.compila.portfolio;

import dev.compila.portfolio.dto.UserProjectRequest;
import dev.compila.portfolio.dto.UserProjectResponse;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserProjectService {

    private final UserProjectRepository userProjectRepository;
    private final UserRepository userRepository;

    public UserProjectService(UserProjectRepository userProjectRepository, UserRepository userRepository) {
        this.userProjectRepository = userProjectRepository;
        this.userRepository = userRepository;
    }

    public List<UserProjectResponse> getPublicProjectsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return userProjectRepository.findByUserIdAndPublicProjectTrueOrderByCreatedAtDesc(user.getId()).stream()
                .map(UserProjectResponse::from)
                .toList();
    }

    public List<UserProjectResponse> getProjectsForUser(UUID userId) {
        return userProjectRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(UserProjectResponse::from)
                .toList();
    }

    public UserProjectResponse getProject(UUID projectId) {
        UserProject project = userProjectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        return UserProjectResponse.from(project);
    }

    @Transactional
    public UserProjectResponse createProject(UUID userId, UserProjectRequest request) {
        UserProject project = new UserProject();
        project.setUserId(userId);
        applyRequest(project, request);
        return UserProjectResponse.from(userProjectRepository.save(project));
    }

    @Transactional
    public UserProjectResponse updateProject(UUID projectId, UUID userId, UserProjectRequest request) {
        UserProject project = userProjectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found for user"));
        applyRequest(project, request);
        return UserProjectResponse.from(userProjectRepository.save(project));
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        UserProject project = userProjectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found for user"));
        userProjectRepository.delete(project);
    }

    private void applyRequest(UserProject project, UserProjectRequest request) {
        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setShortDescription(request.shortDescription());
        project.setProjectUrl(request.projectUrl());
        project.setRepositoryUrl(request.repositoryUrl());
        project.setDemoUrl(request.demoUrl());
        project.setCoverImageUrl(request.coverImageUrl());
        project.setTechnologies(request.technologies() != null ? request.technologies().toArray(new String[0]) : null);
        project.setTags(request.tags() != null ? request.tags().toArray(new String[0]) : null);
        if (request.featured() != null) {
            project.setFeatured(request.featured());
        }
        if (request.publicProject() != null) {
            project.setPublicProject(request.publicProject());
        }
    }
}
