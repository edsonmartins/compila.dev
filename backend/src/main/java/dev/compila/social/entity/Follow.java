package dev.compila.social.entity;

import dev.compila.common.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

/**
 * Follow entity - tracks user following relationships
 * User A follows User B
 */
@Entity
@Table(name = "follows",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_follower_following", columnNames = {"follower_id", "following_id"})
    }
)
public class Follow extends BaseEntity {

    /**
     * The user who is following someone
     */
    @Column(name = "follower_id", nullable = false)
    private UUID followerId;

    /**
     * The user being followed
     */
    @Column(name = "following_id", nullable = false)
    private UUID followingId;

    // Constructors
    public Follow() {
    }

    public Follow(UUID followerId, UUID followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    // Getters and Setters
    public UUID getFollowerId() {
        return followerId;
    }

    public void setFollowerId(UUID followerId) {
        this.followerId = followerId;
    }

    public UUID getFollowingId() {
        return followingId;
    }

    public void setFollowingId(UUID followingId) {
        this.followingId = followingId;
    }
}
