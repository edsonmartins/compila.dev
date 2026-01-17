package dev.compila.admin.dto;

public record AdminModerationItemDTO(
    String id,
    String type,
    String content,
    Author author,
    String status,
    String reportReason,
    Reporter reportedBy,
    String createdAt,
    Metadata metadata
) {
    public record Author(
        String id,
        String username,
        String fullName,
        String avatarUrl
    ) {}

    public record Reporter(
        String username,
        String fullName
    ) {}

    public record Metadata(
        String postType,
        boolean codeSnippet
    ) {}
}
