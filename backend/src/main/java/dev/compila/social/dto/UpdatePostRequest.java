package dev.compila.social.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

/**
 * Request DTO for updating an existing social post
 */
public record UpdatePostRequest(
        @NotBlank(message = "Content is required")
        String content,

        /**
         * Updated code snippet
         */
        Map<String, Object> codeSnippet,

        /**
         * Updated metadata
         */
        Map<String, Object> metadata
) {
}
