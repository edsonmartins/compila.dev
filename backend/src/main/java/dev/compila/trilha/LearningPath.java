package dev.compila.trilha;

import dev.compila.common.BaseEntity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "learning_paths")
public class LearningPath extends BaseEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "short_description", length = 255)
    private String shortDescription;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ChallengeStack stack;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ChallengeLevel level;

    @Column(name = "estimated_weeks")
    private Integer estimatedWeeks;

    @Column(name = "xp_total")
    private Integer xpTotal = 0;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "enrolled_count")
    private Integer enrolledCount = 0;

    @Column(name = "completed_count")
    private Integer completedCount = 0;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(name = "author_id")
    private UUID authorId;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "author_avatar_url", length = 500)
    private String authorAvatarUrl;

    public enum ChallengeStack {
        FRONTEND, BACKEND, MOBILE, DEVOPS, FULL_STACK, DATA_SCIENCE
    }

    public enum ChallengeLevel {
        BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public ChallengeStack getStack() { return stack; }
    public void setStack(ChallengeStack stack) { this.stack = stack; }

    public ChallengeLevel getLevel() { return level; }
    public void setLevel(ChallengeLevel level) { this.level = level; }

    public Integer getEstimatedWeeks() { return estimatedWeeks; }
    public void setEstimatedWeeks(Integer estimatedWeeks) { this.estimatedWeeks = estimatedWeeks; }

    public Integer getXpTotal() { return xpTotal; }
    public void setXpTotal(Integer xpTotal) { this.xpTotal = xpTotal; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Integer getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(Integer enrolledCount) { this.enrolledCount = enrolledCount; }

    public Integer getCompletedCount() { return completedCount; }
    public void setCompletedCount(Integer completedCount) { this.completedCount = completedCount; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public UUID getAuthorId() { return authorId; }
    public void setAuthorId(UUID authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorAvatarUrl() { return authorAvatarUrl; }
    public void setAuthorAvatarUrl(String authorAvatarUrl) { this.authorAvatarUrl = authorAvatarUrl; }
}
