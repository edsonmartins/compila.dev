package dev.compila.trilha.dto;

import dev.compila.trilha.LearningPath;
import java.util.UUID;

public record LearningPathResponse(
        UUID id,
        String slug,
        String title,
        String description,
        String shortDescription,
        String stack,
        String level,
        Integer estimatedWeeks,
        Integer xpTotal,
        String coverImageUrl,
        Integer enrolledCount,
        Integer completedCount,
        Boolean featured,
        String authorName,
        String authorAvatarUrl
) {
    public static LearningPathResponse from(LearningPath path) {
        return new LearningPathResponse(
                path.getId(),
                path.getSlug(),
                path.getTitle(),
                path.getDescription(),
                path.getShortDescription(),
                path.getStack().name(),
                path.getLevel().name(),
                path.getEstimatedWeeks(),
                path.getXpTotal(),
                path.getCoverImageUrl(),
                path.getEnrolledCount(),
                path.getCompletedCount(),
                path.getFeatured(),
                path.getAuthorName(),
                path.getAuthorAvatarUrl()
        );
    }
}
