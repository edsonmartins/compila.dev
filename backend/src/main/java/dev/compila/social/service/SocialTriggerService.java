package dev.compila.social.service;

import dev.compila.social.dto.CreatePostRequest;
import dev.compila.social.dto.FeedPostResponse;
import dev.compila.social.enums.PostType;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service for automatic social posts based on user achievements
 * Creates posts when users complete challenges or earn badges (if enabled)
 */
@Service
public class SocialTriggerService {

    private static final Logger log = LoggerFactory.getLogger(SocialTriggerService.class);

    private final SocialService socialService;
    private final UserRepository userRepository;

    public SocialTriggerService(SocialService socialService, UserRepository userRepository) {
        this.socialService = socialService;
        this.userRepository = userRepository;
    }

    /**
     * Trigger an automatic post when user completes a challenge
     * Only creates post if user has auto_share_milestones enabled
     */
    @Transactional
    public FeedPostResponse triggerChallengeShare(UUID userId, UUID challengeId, String challengeTitle, int xpGained) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user has auto-share enabled
        if (user.getAutoShareMilestones() == null || !user.getAutoShareMilestones()) {
            log.debug("User {} has auto-share disabled, skipping challenge share", userId);
            return null;
        }

        // Check if already shared this challenge recently (avoid duplicate posts)
        // This is a simple check - could be enhanced with a separate tracking table
        if (hasRecentlySharedChallenge(userId, challengeId)) {
            log.debug("User {} already recently shared challenge {}", userId, challengeId);
            return null;
        }

        // Create the post
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("challengeId", challengeId.toString());
        metadata.put("challengeTitle", challengeTitle);
        metadata.put("xpGained", xpGained);

        CreatePostRequest request = new CreatePostRequest(
                generateChallengeShareContent(challengeTitle, xpGained),
                PostType.CHALLENGE_COMPLETED,
                null,
                metadata,
                challengeId.toString(),
                null,
                null
        );

        log.info("Creating auto-share post for user {} completing challenge {}", userId, challengeTitle);
        return socialService.createPost(userId, request);
    }

    /**
     * Trigger an automatic post when user earns a badge
     * Only creates post if user has auto_share_milestones enabled
     */
    @Transactional
    public FeedPostResponse triggerBadgeShare(UUID userId, String badgeName, String badgeIcon, String badgeDescription) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user has auto-share enabled
        if (user.getAutoShareMilestones() == null || !user.getAutoShareMilestones()) {
            log.debug("User {} has auto-share disabled, skipping badge share", userId);
            return null;
        }

        // Create the post
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("badgeName", badgeName);
        metadata.put("badgeIcon", badgeIcon);
        metadata.put("badgeDescription", badgeDescription);

        CreatePostRequest request = new CreatePostRequest(
                generateBadgeShareContent(badgeName),
                PostType.ACHIEVEMENT,
                null,
                metadata,
                null,
                null,
                null
        );

        log.info("Creating auto-share post for user {} earning badge {}", userId, badgeName);
        return socialService.createPost(userId, request);
    }

    /**
     * Trigger an automatic post when user reaches a milestone
     * Only creates post if user has auto_share_milestones enabled
     */
    @Transactional
    public FeedPostResponse triggerMilestonePost(UUID userId, String milestone, int xp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user has auto-share enabled
        if (user.getAutoShareMilestones() == null || !user.getAutoShareMilestones()) {
            log.debug("User {} has auto-share disabled, skipping milestone share", userId);
            return null;
        }

        // Create the post
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("milestone", milestone);
        metadata.put("xp", xp);

        CreatePostRequest request = new CreatePostRequest(
                generateMilestoneShareContent(milestone),
                PostType.ACHIEVEMENT,
                null,
                metadata,
                null,
                null,
                null
        );

        log.info("Creating auto-share post for user {} reaching milestone {}", userId, milestone);
        return socialService.createPost(userId, request);
    }

    /**
     * Generate content for challenge completion post
     */
    private String generateChallengeShareContent(String challengeTitle, int xpGained) {
        return String.format(
                "🏆 Acabei de completar o desafio \"%s\" e ganhei +%d XP! #CompilaDev",
                challengeTitle,
                xpGained
        );
    }

    /**
     * Generate content for badge achievement post
     */
    private String generateBadgeShareContent(String badgeName) {
        return String.format(
                "⭐ Acabei de desbloquear a conquista \"%s\"! Mais uma conquista na minha jornada de dev! #CompilaDev",
                badgeName
        );
    }

    /**
     * Generate content for milestone post
     */
    private String generateMilestoneShareContent(String milestone) {
        return String.format(
                "🎉 Acabei de atingir %s na minha jornada de programação! Obrigado à comunidade Compila.dev! 🚀",
                milestone
        );
    }

    /**
     * Simple check to avoid duplicate posts for the same challenge
     * In production, this should use a separate tracking table or cache
     */
    private boolean hasRecentlySharedChallenge(UUID userId, UUID challengeId) {
        // Check if user has a post about this challenge in the last 24 hours
        try {
            var existingPosts = socialService.getRecentPostsByUser(userId, 10);
            return existingPosts.stream()
                    .filter(p -> p.type() == PostType.CHALLENGE_COMPLETED)
                    .filter(p -> p.metadata() != null)
                    .filter(p -> challengeId.toString().equals(p.metadata().get("challengeId")))
                    .filter(p -> p.createdAt() != null)
                    .anyMatch(p -> {
                        var hoursSince = java.time.temporal.ChronoUnit.HOURS.between(
                                p.createdAt(),
                                java.time.LocalDateTime.now()
                        );
                        return hoursSince < 24;
                    });
        } catch (Exception e) {
            log.warn("Error checking for recent challenge shares: {}", e.getMessage());
            return false;
        }
    }
}
