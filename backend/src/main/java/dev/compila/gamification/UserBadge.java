package dev.compila.gamification;

import dev.compila.common.BaseEntity;
import dev.compila.gamification.enums.BadgeType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User Badge entity
 */
@Entity
@Table(name = "user_badges")
@Getter
@Setter
public class UserBadge extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge_type", nullable = false, length = 50)
    private BadgeType badgeType;

    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    public UserBadge() {}

    public UserBadge(UUID userId, BadgeType badgeType) {
        this.userId = userId;
        this.badgeType = badgeType;
        this.earnedAt = LocalDateTime.now();
    }
}
