package dev.compila.admin.dto;

public record CreateChallengeRequest(
    String title,
    String description,
    String difficulty,
    String stack,
    int xpReward,
    Boolean published,
    String requirements,
    String startingCode
) {}
