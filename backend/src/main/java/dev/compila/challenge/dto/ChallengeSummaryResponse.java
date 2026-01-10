package dev.compila.challenge.dto;

import dev.compila.challenge.Challenge;
import dev.compila.challenge.ChallengeLevel;
import dev.compila.challenge.ChallengeStack;

import java.util.List;
import java.util.UUID;

public record ChallengeSummaryResponse(
    UUID id,
    String slug,
    String title,
    String shortDescription,
    ChallengeStack stack,
    ChallengeLevel level,
    Integer difficulty,
    List<String> technologies,
    Integer xpReward,
    Integer estimatedTimeMinutes,
    Integer completedCount,
    Boolean featured
) {
    public static ChallengeSummaryResponse from(Challenge challenge) {
        return new ChallengeSummaryResponse(
            challenge.getId(),
            challenge.getSlug(),
            challenge.getTitle(),
            challenge.getShortDescription(),
            challenge.getStack(),
            challenge.getLevel(),
            challenge.getDifficulty(),
            challenge.getTechnologies(),
            challenge.getXpReward(),
            challenge.getEstimatedTimeMinutes(),
            challenge.getCompletedCount(),
            challenge.getFeatured()
        );
    }
}
