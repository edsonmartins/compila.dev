package dev.compila.gamification.dto;

import java.util.UUID;

public record UserStatsResponse(
    UUID id,
    String username,
    String fullName,
    String avatarUrl,
    Integer level,
    Long xp,
    Integer streakCurrent,
    Integer streakBest,
    Long badgeCount,
    Integer levelProgress
) {}
