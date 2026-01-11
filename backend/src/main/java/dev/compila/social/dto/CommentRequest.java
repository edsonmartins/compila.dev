package dev.compila.social.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

/**
 * Request DTO for creating a comment
 */
public record CommentRequest(
        @NotBlank(message = "Comment content is required")
        String content,

        /**
         * Parent comment ID for nested replies
         */
        String parentId,

        /**
         * Optional code snippet in the comment
         */
        Map<String, Object> codeSnippet
) {
}
