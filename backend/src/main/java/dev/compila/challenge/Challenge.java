package dev.compila.challenge;

import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import dev.compila.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Challenge entity
 */
@Entity
@Table(name = "challenges")
public class Challenge extends BaseEntity {

    @NotBlank
    @Size(min = 3, max = 100)
    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String shortDescription;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Classification
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChallengeStack stack;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChallengeLevel level;

    @Column
    private Integer difficulty;

    @Column(nullable = false)
    private String[] technologies;

    @Column
    private String[] tags;

    // Requirements stored as JSONB
    @Column(columnDefinition = "jsonb")
    private String requirements;

    @Column(columnDefinition = "jsonb")
    private String starterCode;

    @Column(columnDefinition = "jsonb")
    private String solutionCode;

    // Metadata
    @Column(name = "xp_reward")
    private Integer xpReward = 100;

    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes;

    @Column
    private String[] badges;

    // Stats
    @Column(name = "completed_count")
    private Integer completedCount = 0;

    @Column(name = "attempted_count")
    private Integer attemptedCount = 0;

    @Column(name = "success_rate")
    private BigDecimal successRate;

    // Publishing
    @Column(name = "published")
    private Boolean published = false;

    @Column(name = "featured")
    private Boolean featured = false;

    // Author (matches schema)
    @Column(name = "author_id")
    private UUID authorId;

    // Constructors
    public Challenge() {}

    public Challenge(String title, String slug) {
        this.title = title;
        this.slug = slug;
    }

    // Getters and Setters
    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ChallengeStack getStack() {
        return stack;
    }

    public void setStack(ChallengeStack stack) {
        this.stack = stack;
    }

    public ChallengeLevel getLevel() {
        return level;
    }

    public void setLevel(ChallengeLevel level) {
        this.level = level;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public String[] getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String[] technologies) {
        this.technologies = technologies;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public String getSolutionCode() {
        return solutionCode;
    }

    public void setSolutionCode(String solutionCode) {
        this.solutionCode = solutionCode;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public void setXpReward(Integer xpReward) {
        this.xpReward = xpReward;
    }

    public Integer getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
        this.estimatedTimeMinutes = estimatedTimeMinutes;
    }

    public String[] getBadges() {
        return badges;
    }

    public void setBadges(String[] badges) {
        this.badges = badges;
    }

    public Integer getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(Integer completedCount) {
        this.completedCount = completedCount;
    }

    public Integer getAttemptedCount() {
        return attemptedCount;
    }

    public void setAttemptedCount(Integer attemptedCount) {
        this.attemptedCount = attemptedCount;
    }

    public BigDecimal getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(BigDecimal successRate) {
        this.successRate = successRate;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public void setAuthorId(UUID authorId) {
        this.authorId = authorId;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }
}
