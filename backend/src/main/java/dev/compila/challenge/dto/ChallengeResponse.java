package dev.compila.challenge.dto;

import dev.compila.challenge.Challenge;
import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
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
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final TypeReference<Map<String, Object>> REQUIREMENTS_TYPE = new TypeReference<>() {};
    private static final TypeReference<Map<String, String>> STARTER_CODE_TYPE = new TypeReference<>() {};

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
            challenge.getTechnologies() != null ? Arrays.asList(challenge.getTechnologies()) : List.of(),
            challenge.getTags() != null ? Arrays.asList(challenge.getTags()) : List.of(),
            parseRequirements(challenge.getRequirements()),
            parseStarterCode(challenge.getStarterCode()),
            challenge.getXpReward(),
            challenge.getEstimatedTimeMinutes(),
            challenge.getBadges() != null ? Arrays.asList(challenge.getBadges()) : List.of(),
            challenge.getCompletedCount(),
            challenge.getAttemptedCount(),
            challenge.getSuccessRate() != null ? challenge.getSuccessRate().doubleValue() : null,
            challenge.getCreatedAt(),
            challenge.getUpdatedAt()
        );
    }

    private static Map<String, Object> parseRequirements(String requirements) {
        if (requirements == null || requirements.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(requirements, REQUIREMENTS_TYPE);
        } catch (Exception e) {
            return Map.of();
        }
    }

    private static Map<String, String> parseStarterCode(String starterCode) {
        if (starterCode == null || starterCode.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(starterCode, STARTER_CODE_TYPE);
        } catch (Exception e) {
            return Map.of();
        }
    }
}
