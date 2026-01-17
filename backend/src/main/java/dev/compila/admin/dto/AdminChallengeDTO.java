package dev.compila.admin.dto;

public record AdminChallengeDTO(
    String id,
    String title,
    String description,
    String difficulty,
    String stack,
    int xpReward,
    boolean published,
    String createdAt,
    int completionCount,
    double successRate
) {}
