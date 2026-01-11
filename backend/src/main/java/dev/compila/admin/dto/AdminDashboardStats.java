package dev.compila.admin.dto;

import java.util.List;

public record AdminDashboardStats(
        Long totalUsers,
        Long activeUsers,
        Long totalChallenges,
        Long totalSubmissions,
        Double successRate,
        Long avgCompletionTimeMinutes,
        List<TopUser> topUsers,
        List<RecentActivity> recentActivities
) {
    public record TopUser(
            String id,
            String username,
            String fullName,
            String avatarUrl,
            Long xp,
            Integer level,
            Integer challengesCompleted
    ) {}

    public record RecentActivity(
            String id,
            String type,
            String username,
            String fullName,
            String description,
            String createdAt
    ) {}
}
