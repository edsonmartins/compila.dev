package dev.compila.social.dto;

import dev.compila.social.enums.KudoType;
import dev.compila.social.enums.PostType;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Response DTO for a feed post
 */
public record FeedPostResponse(
        String id,
        String userId,
        String username,
        String fullName,
        String avatarUrl,
        String content,
        PostType type,
        Map<String, Object> codeSnippet,
        Map<String, Object> metadata,

        // Kudos counts
        int fireCount,
        int rocketCount,
        int lightbulbCount,
        int cleanCount,
        int targetCount,
        int pairCount,
        int totalKudos,

        // User's kudo on this post (if any)
        KudoType userKudo,

        // Engagement
        int commentCount,
        int viewCount,

        // Solution info for QUESTION posts
        String solutionCommentId,
        boolean isSolved,

        // Timestamps
        LocalDateTime createdAt,
        LocalDateTime publishedAt,
        String timeAgo,

        // Additional info
        String imageUrl,
        String challengeId,
        String badgeId
) {
}
