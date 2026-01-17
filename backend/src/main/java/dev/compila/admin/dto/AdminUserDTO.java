package dev.compila.admin.dto;

public record AdminUserDTO(
    String id,
    String username,
    String email,
    String fullName,
    String avatarUrl,
    String role,
    boolean enabled,
    boolean emailVerified,
    int level,
    long xp,
    int streakCurrent,
    String subscription,
    String createdAt,
    String lastLoginAt,
    int challengesCompleted
) {}
