package dev.compila.portfolio.dto;

import dev.compila.portfolio.UserProject;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record UserProjectResponse(
        UUID id,
        UUID userId,
        String title,
        String description,
        String shortDescription,
        String projectUrl,
        String repositoryUrl,
        String demoUrl,
        String coverImageUrl,
        List<String> technologies,
        List<String> tags,
        Boolean featured,
        Boolean publicProject,
        Integer viewsCount,
        Integer likesCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserProjectResponse from(UserProject project) {
        return new UserProjectResponse(
                project.getId(),
                project.getUserId(),
                project.getTitle(),
                project.getDescription(),
                project.getShortDescription(),
                project.getProjectUrl(),
                project.getRepositoryUrl(),
                project.getDemoUrl(),
                project.getCoverImageUrl(),
                project.getTechnologies() != null ? Arrays.asList(project.getTechnologies()) : List.of(),
                project.getTags() != null ? Arrays.asList(project.getTags()) : List.of(),
                project.getFeatured(),
                project.getPublicProject(),
                project.getViewsCount(),
                project.getLikesCount(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
