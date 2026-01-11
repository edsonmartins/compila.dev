package dev.compila.social.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Response DTO for a comment
 */
public record CommentResponse(
        String id,
        String userId,
        String username,
        String fullName,
        String avatarUrl,
        String postId,
        String parentId,
        String content,
        Map<String, Object> codeSnippet,
        boolean isSolution,
        int fireCount,
        LocalDateTime acceptedAt,
        LocalDateTime createdAt,
        String timeAgo,

        // Nested replies
        int replyCount,

        // Whether this is the user's comment
        boolean isOwnComment,

        // Whether comment is deleted
        boolean isDeleted
) {
}
