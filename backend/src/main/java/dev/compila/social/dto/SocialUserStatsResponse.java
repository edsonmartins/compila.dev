package dev.compila.social.dto;

import java.util.List;

/**
 * Response DTO for user profile stats in the social context
 */
public record SocialUserStatsResponse(
        String userId,
        String username,
        String fullName,
        String avatarUrl,
        String bio,
        int postsCount,
        int followersCount,
        int followingCount,
        int totalKudosReceived,
        int solutionsProvided,
        List<String> topTechnologies,
        List<String> badges
) {
}
