package dev.compila.gamification;

import dev.compila.gamification.enums.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {

    List<UserBadge> findByUserIdOrderByEarnedAtDesc(UUID userId);

    boolean existsByUserIdAndBadgeType(UUID userId, BadgeType badgeType);

    @Query("SELECT COUNT(ub) FROM UserBadge ub WHERE ub.userId = :userId")
    long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT ub FROM UserBadge ub WHERE ub.userId = :userId ORDER BY ub.earnedAt DESC")
    List<UserBadge> findRecentBadges(@Param("userId") UUID userId);
}
