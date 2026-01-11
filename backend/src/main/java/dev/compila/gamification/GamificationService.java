package dev.compila.gamification;

import dev.compila.gamification.dto.BadgeResponse;
import dev.compila.gamification.dto.RankingResponse;
import dev.compila.gamification.dto.UserStatsResponse;
import dev.compila.gamification.enums.BadgeType;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GamificationService {

    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;

    public GamificationService(UserBadgeRepository userBadgeRepository, UserRepository userRepository) {
        this.userBadgeRepository = userBadgeRepository;
        this.userRepository = userRepository;
    }

    public List<BadgeResponse> getUserBadges(UUID userId) {
        return userBadgeRepository.findByUserIdOrderByEarnedAtDesc(userId).stream()
                .map(BadgeResponse::from)
                .toList();
    }

    public UserStatsResponse getUserStats(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long badgeCount = userBadgeRepository.countByUserId(userId);

        return new UserStatsResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getLevel(),
                user.getXp(),
                user.getStreakCurrent(),
                user.getStreakBest(),
                badgeCount,
                calculateLevelProgress(user.getXp(), user.getLevel())
        );
    }

    @Transactional
    public BadgeResponse awardBadge(UUID userId, BadgeType badgeType) {
        if (userBadgeRepository.existsByUserIdAndBadgeType(userId, badgeType)) {
            throw new RuntimeException("User already has this badge");
        }

        UserBadge badge = new UserBadge(userId, badgeType);
        badge = userBadgeRepository.save(badge);

        return BadgeResponse.from(badge);
    }

    @Transactional
    public void addXp(UUID userId, int xp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setXp(user.getXp() + xp);

        // Calculate new level (every 1000 XP = 1 level)
        int newLevel = 1 + (int) (user.getXp() / 1000);
        user.setLevel(newLevel);

        userRepository.save(user);

        // Check for badge unlocks
        checkXpBadges(userId, user.getXp());
    }

    @Transactional
    public void updateStreak(UUID userId, int streak) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStreakCurrent(streak);
        if (streak > user.getStreakBest()) {
            user.setStreakBest(streak);
        }

        userRepository.save(user);

        // Check for streak badges
        checkStreakBadges(userId, streak);
    }

    private void checkXpBadges(UUID userId, long xp) {
        if (xp >= 1000) {
            awardBadgeIfNotExists(userId, BadgeType.XP_1000);
        }
        if (xp >= 5000) {
            awardBadgeIfNotExists(userId, BadgeType.XP_5000);
        }
        if (xp >= 10000) {
            awardBadgeIfNotExists(userId, BadgeType.XP_10000);
        }
    }

    private void checkStreakBadges(UUID userId, int streak) {
        if (streak >= 7) {
            awardBadgeIfNotExists(userId, BadgeType.STREAK_7);
        }
        if (streak >= 30) {
            awardBadgeIfNotExists(userId, BadgeType.STREAK_30);
        }
        if (streak >= 100) {
            awardBadgeIfNotExists(userId, BadgeType.STREAK_100);
        }
    }

    private void awardBadgeIfNotExists(UUID userId, BadgeType badgeType) {
        if (!userBadgeRepository.existsByUserIdAndBadgeType(userId, badgeType)) {
            UserBadge badge = new UserBadge(userId, badgeType);
            userBadgeRepository.save(badge);
        }
    }

    private int calculateLevelProgress(long xp, int level) {
        long xpInCurrentLevel = xp - (level * 1000L);
        return (int) ((xpInCurrentLevel / 1000.0) * 100);
    }

    /**
     * Get global ranking by XP
     * @param limit Maximum number of users to return
     * @return List of users ordered by XP descending
     */
    public List<RankingResponse> getRanking(int limit) {
        List<Object[]> results = userRepository.findRankingData();

        return results.stream()
                .limit(limit)
                .map(row -> new RankingResponse(
                        (UUID) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        (Integer) row[4],
                        (Long) row[5],
                        results.indexOf(row) + 1
                ))
                .toList();
    }
}
