package dev.compila.challenge.dto;

import dev.compila.challenge.Challenge;
import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;

import java.util.Arrays;
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
            challenge.getTechnologies() != null ? Arrays.asList(challenge.getTechnologies()) : List.of(),
            challenge.getXpReward(),
            challenge.getEstimatedTimeMinutes(),
            challenge.getCompletedCount(),
            challenge.getFeatured()
        );
    }
}
