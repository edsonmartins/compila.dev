package dev.compila.challenge.dto;

import dev.compila.challenge.Challenge;
import dev.compila.challenge.ChallengeLevel;
import dev.compila.challenge.ChallengeStack;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ChallengeResponse(
    UUID id,
    String slug,
    String title,
    String shortDescription,
    String description,
    ChallengeStack stack,
    ChallengeLevel level,
    Integer difficulty,
    List<String> technologies,
    List<String> tags,
    Map<String, Object> requirements,
    Map<String, String> starterCode,
    Integer xpReward,
    Integer estimatedTimeMinutes,
    List<String> badges,
    Integer completedCount,
    Integer attemptedCount,
    Double successRate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ChallengeResponse from(Challenge challenge) {
        return new ChallengeResponse(
            challenge.getId(),
            challenge.getSlug(),
            challenge.getTitle(),
            challenge.getShortDescription(),
            challenge.getDescription(),
            challenge.getStack(),
            challenge.getLevel(),
            challenge.getDifficulty(),
            challenge.getTechnologies(),
            challenge.getTags(),
            challenge.getRequirements(),
            challenge.getStarterCode(),
            challenge.getXpReward(),
            challenge.getEstimatedTimeMinutes(),
            challenge.getBadges(),
            challenge.getCompletedCount(),
            challenge.getAttemptedCount(),
            challenge.getSuccessRate() != null ? challenge.getSuccessRate().doubleValue() : null,
            challenge.getCreatedAt(),
            challenge.getUpdatedAt()
        );
    }
}
