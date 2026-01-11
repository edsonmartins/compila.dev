package dev.compila.gamification.dto;

import java.util.UUID;

public record RankingResponse(
        UUID id,
        String username,
        String fullName,
        String avatarUrl,
        int level,
        long xp,
        int rank
) {
    public static RankingResponse from(Object[] row, int rank) {
        UUID id = (UUID) row[0];
        String username = (String) row[1];
        String fullName = (String) row[2];
        String avatarUrl = (String) row[3];
        int level = (Integer) row[4];
        long xp = (Long) row[5];
        return new RankingResponse(id, username, fullName, avatarUrl, level, xp, rank);
    }
}
