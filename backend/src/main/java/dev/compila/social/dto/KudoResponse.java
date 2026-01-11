package dev.compila.social.dto;

import dev.compila.social.enums.KudoType;

/**
 * Response DTO for kudo operation
 */
public record KudoResponse(
        boolean success,
        String postId,
        KudoType kudoType,
        String message,
        // Updated kudos counts
        int fireCount,
        int rocketCount,
        int lightbulbCount,
        int cleanCount,
        int targetCount,
        int pairCount,
        int totalKudos
) {
}
