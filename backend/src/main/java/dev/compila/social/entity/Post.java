package dev.compila.social.entity;

import dev.compila.common.BaseEntity;
import dev.compila.social.enums.PostType;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Social feed post entity
 * Represents a user post in the developer community feed
 */
@Entity
@Table(name = "posts")
public class Post extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PostType type;

    /**
     * Code snippet associated with the post (for SNIPPET, QUESTION, CODE_REVIEW types)
     * Stored as JSONB: {language, code, lineHighlights, description}
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> codeSnippet;

    /**
     * Additional metadata for the post
     * For CHALLENGE_COMPLETED: {challengeId, challengeTitle, xpGained}
     * For ACHIEVEMENT: {badgeId, badgeName, badgeIcon}
     * For PAIR_REQUEST: {technologies, availability, duration}
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    // Kudos counters - denormalized for performance
    @Column(name = "fire_count", nullable = false)
    private Integer fireCount = 0;

    @Column(name = "rocket_count", nullable = false)
    private Integer rocketCount = 0;

    @Column(name = "lightbulb_count", nullable = false)
    private Integer lightbulbCount = 0;

    @Column(name = "clean_count", nullable = false)
    private Integer cleanCount = 0;

    @Column(name = "target_count", nullable = false)
    private Integer targetCount = 0;

    @Column(name = "pair_count", nullable = false)
    private Integer pairCount = 0;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "comment_count", nullable = false)
    private Integer commentCount = 0;

    /**
     * For QUESTION posts - ID of the comment that solved the question
     */
    @Column(name = "solution_comment_id")
    private UUID solutionCommentId;

    /**
     * For QUESTION posts - whether the question has been marked as solved
     */
    @Column(name = "is_solved", nullable = false)
    private Boolean isSolved = false;

    /**
     * Whether the post is published (false = draft)
     */
    @Column(name = "published", nullable = false)
    private Boolean published = true;

    /**
     * When the post was published (for scheduled posts or drafts)
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * URL to an image attached to the post
     */
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Related challenge ID (for CHALLENGE_COMPLETED posts)
     */
    @Column(name = "challenge_id")
    private UUID challengeId;

    /**
     * Related badge ID (for ACHIEVEMENT posts)
     */
    @Column(name = "badge_id")
    private UUID badgeId;

    // Constructors
    public Post() {
    }

    public Post(UUID userId, String content, PostType type) {
        this.userId = userId;
        this.content = content;
        this.type = type;
        this.publishedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PostType getType() {
        return type;
    }

    public void setType(PostType type) {
        this.type = type;
    }

    public Map<String, Object> getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(Map<String, Object> codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public Integer getFireCount() {
        return fireCount;
    }

    public void setFireCount(Integer fireCount) {
        this.fireCount = fireCount;
    }

    public Integer getRocketCount() {
        return rocketCount;
    }

    public void setRocketCount(Integer rocketCount) {
        this.rocketCount = rocketCount;
    }

    public Integer getLightbulbCount() {
        return lightbulbCount;
    }

    public void setLightbulbCount(Integer lightbulbCount) {
        this.lightbulbCount = lightbulbCount;
    }

    public Integer getCleanCount() {
        return cleanCount;
    }

    public void setCleanCount(Integer cleanCount) {
        this.cleanCount = cleanCount;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(Integer targetCount) {
        this.targetCount = targetCount;
    }

    public Integer getPairCount() {
        return pairCount;
    }

    public void setPairCount(Integer pairCount) {
        this.pairCount = pairCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public UUID getSolutionCommentId() {
        return solutionCommentId;
    }

    public void setSolutionCommentId(UUID solutionCommentId) {
        this.solutionCommentId = solutionCommentId;
    }

    public Boolean getIsSolved() {
        return isSolved;
    }

    public void setIsSolved(Boolean isSolved) {
        this.isSolved = isSolved;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public UUID getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(UUID challengeId) {
        this.challengeId = challengeId;
    }

    public UUID getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(UUID badgeId) {
        this.badgeId = badgeId;
    }

    /**
     * Increment a specific kudo counter
     */
    public void incrementKudoCount(String kudoType) {
        switch (kudoType.toLowerCase()) {
            case "fire" -> fireCount++;
            case "rocket" -> rocketCount++;
            case "lightbulb" -> lightbulbCount++;
            case "clean" -> cleanCount++;
            case "target" -> targetCount++;
            case "pair" -> pairCount++;
        }
    }

    /**
     * Decrement a specific kudo counter
     */
    public void decrementKudoCount(String kudoType) {
        switch (kudoType.toLowerCase()) {
            case "fire" -> fireCount = Math.max(0, fireCount - 1);
            case "rocket" -> rocketCount = Math.max(0, rocketCount - 1);
            case "lightbulb" -> lightbulbCount = Math.max(0, lightbulbCount - 1);
            case "clean" -> cleanCount = Math.max(0, cleanCount - 1);
            case "target" -> targetCount = Math.max(0, targetCount - 1);
            case "pair" -> pairCount = Math.max(0, pairCount - 1);
        }
    }

    /**
     * Get total kudos count
     */
    public int getTotalKudos() {
        return fireCount + rocketCount + lightbulbCount + cleanCount + targetCount + pairCount;
    }

    /**
     * Calculate trending score for the post
     * Formula: weighted kudos / (1 + hours_since_post / 24)
     */
    public double calculateTrendingScore() {
        long hoursSincePost = java.time.temporal.ChronoUnit.HOURS.between(
            publishedAt != null ? publishedAt : getCreatedAt(),
            LocalDateTime.now()
        );

        double weightedKudos = (fireCount * 5.0) + (rocketCount * 5.0) +
                               (cleanCount * 4.0) + (lightbulbCount * 3.0) +
                               (targetCount * 3.0) + (pairCount * 2.0);

        // Boost for recent posts
        if (hoursSincePost < 24) {
            weightedKudos *= 2.0;
        }

        // Boost for posts with code
        if (codeSnippet != null && !codeSnippet.isEmpty()) {
            weightedKudos *= 1.5;
        }

        // Boost for solved questions
        if (isSolved) {
            weightedKudos *= 3.0;
        }

        return weightedKudos / (1.0 + hoursSincePost / 24.0);
    }
}
