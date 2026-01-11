package dev.compila.social.dto;

import dev.compila.social.enums.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

/**
 * Request DTO for creating a new social post
 */
public record CreatePostRequest(
        @NotBlank(message = "Content is required")
        String content,

        @NotNull(message = "Post type is required")
        PostType type,

        /**
         * Optional code snippet for SNIPPET, QUESTION, or CODE_REVIEW posts
         * Format: {language, code, lineHighlights: [1, 2, 3], description}
         */
        Map<String, Object> codeSnippet,

        /**
         * Optional metadata for the post
         * For PAIR_REQUEST: {technologies: ["React", "TypeScript"], availability: "weekends"}
         * For CHALLENGE_COMPLETED: {challengeId, challengeTitle, xpGained}
         * For ACHIEVEMENT: {badgeId, badgeName, badgeIcon}
         */
        Map<String, Object> metadata,

        /**
         * Optional image URL
         */
        String imageUrl,

        /**
         * Related challenge ID (for CHALLENGE_COMPLETED type)
         */
        String challengeId,

        /**
         * Related badge ID (for ACHIEVEMENT type)
         */
        String badgeId
) {
}
