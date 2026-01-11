package dev.compila.social.entity;

import dev.compila.common.BaseEntity;
import dev.compila.social.enums.KudoType;
import jakarta.persistence.*;

import java.util.UUID;

/**
 * Kudo entity - replaces traditional likes with developer-specific recognition
 * Each user can only give one type of kudo per post (can change type)
 */
@Entity
@Table(name = "kudos",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_post_kudo", columnNames = {"user_id", "post_id"})
    }
)
public class Kudo extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Enumerated(EnumType.STRING)
    @Column(name = "kudo_type", nullable = false, length = 20)
    private KudoType kudoType;

    /**
     * Whether this kudo is active (false if user removed their kudo)
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Constructors
    public Kudo() {
    }

    public Kudo(UUID userId, UUID postId, KudoType kudoType) {
        this.userId = userId;
        this.postId = postId;
        this.kudoType = kudoType;
        this.isActive = true;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getPostId() {
        return postId;
    }

    public void setPostId(UUID postId) {
        this.postId = postId;
    }

    public KudoType getKudoType() {
        return kudoType;
    }

    public void setKudoType(KudoType kudoType) {
        this.kudoType = kudoType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
