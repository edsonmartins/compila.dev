package dev.compila.social.dto;

/**
 * Response DTO for user following information
 */
public record FollowResponse(
        boolean following,
        int followersCount,
        int followingCount
) {
}
