package dev.compila.user.dto;

import dev.compila.user.User;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String username,
        String fullName,
        String bio,
        String avatarUrl,
        String location,
        String websiteUrl,
        String githubUrl,
        String linkedinUrl,
        Integer level,
        Long xp,
        Integer streakCurrent,
        Integer streakBest,
        LocalDateTime joinedAt,
        Integer completedChallenges,
        Integer attemptedChallenges
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getLocation(),
                user.getWebsiteUrl(),
                user.getGithubUrl(),
                user.getLinkedinUrl(),
                user.getLevel(),
                user.getXp(),
                user.getStreakCurrent(),
                user.getStreakBest(),
                user.getCreatedAt(),
                0, // TODO: Add completed challenges count
                0  // TODO: Add attempted challenges count
        );
    }
}
