package dev.compila.user.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 100)
        String fullName,
        @Size(max = 500)
        String bio,
        @Size(max = 500)
        String avatarUrl,
        @Size(max = 100)
        String location,
        @Size(max = 500)
        String websiteUrl,
        @Size(max = 500)
        String githubUrl,
        @Size(max = 500)
        String linkedinUrl
) {}
