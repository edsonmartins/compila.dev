package dev.compila.gamification.dto;

import dev.compila.gamification.UserBadge;
import dev.compila.gamification.enums.BadgeType;

import java.time.LocalDateTime;
import java.util.UUID;

public record BadgeResponse(
    UUID id,
    UUID userId,
    BadgeType badgeType,
    String name,
    String description,
    String icon,
    LocalDateTime earnedAt
) {
    public static BadgeResponse from(UserBadge badge) {
        return new BadgeResponse(
            badge.getId(),
            badge.getUserId(),
            badge.getBadgeType(),
            getBadgeName(badge.getBadgeType()),
            getBadgeDescription(badge.getBadgeType()),
            getBadgeIcon(badge.getBadgeType()),
            badge.getEarnedAt()
        );
    }

    private static String getBadgeName(BadgeType type) {
        return switch (type) {
            case FIRST_CHALLENGE -> "Primeiro Desafio";
            case STREAK_7 -> "Streak de 7 Dias";
            case STREAK_30 -> "Streak de 30 Dias";
            case STREAK_100 -> "Streak de 100 Dias";
            case XP_1000 -> "1.000 XP";
            case XP_5000 -> "5.000 XP";
            case XP_10000 -> "10.000 XP";
            case PERFECT_SCORE -> "Nota Perfeita";
            case SPEED_RUNNER -> "Velocista";
            case HELPER -> "Ajudante";
            case MENTOR -> "Mentor";
            case EXPLORER -> "Explorador";
            case MASTER_FRONTEND -> "Mestre Frontend";
            case MASTER_BACKEND -> "Mestre Backend";
            case MASTER_FULLSTACK -> "Mestre Fullstack";
        };
    }

    private static String getBadgeDescription(BadgeType type) {
        return switch (type) {
            case FIRST_CHALLENGE -> "Completou seu primeiro desafio";
            case STREAK_7 -> "Manteve uma sequência de 7 dias";
            case STREAK_30 -> "Manteve uma sequência de 30 dias";
            case STREAK_100 -> "Manteve uma sequência de 100 dias";
            case XP_1000 -> "Acumulou 1.000 XP";
            case XP_5000 -> "Acumulou 5.000 XP";
            case XP_10000 -> "Acumulou 10.000 XP";
            case PERFECT_SCORE -> "Concluiu um desafio com 100%";
            case SPEED_RUNNER -> "Completou um desafio em tempo recorde";
            case HELPER -> "Ajudou outros usuários no feed";
            case MENTOR -> "Mentorou 10 ou mais alunos";
            case EXPLORER -> "Experimentou todas as tecnologias";
            case MASTER_FRONTEND -> "Domina todas as tecnologias frontend";
            case MASTER_BACKEND -> "Domina todas as tecnologias backend";
            case MASTER_FULLSTACK -> "É completo em frontend e backend";
        };
    }

    private static String getBadgeIcon(BadgeType type) {
        return switch (type) {
            case FIRST_CHALLENGE -> "🎯";
            case STREAK_7 -> "🔥";
            case STREAK_30 -> "💥";
            case STREAK_100 -> "⚡";
            case XP_1000 -> "⭐";
            case XP_5000 -> "🌟";
            case XP_10000 -> "💫";
            case PERFECT_SCORE -> "💯";
            case SPEED_RUNNER -> "🏃";
            case HELPER -> "🤝";
            case MENTOR -> "👨‍🏫";
            case EXPLORER -> "🧭";
            case MASTER_FRONTEND -> "🎨";
            case MASTER_BACKEND -> "⚙️";
            case MASTER_FULLSTACK -> "👑";
        };
    }
}
