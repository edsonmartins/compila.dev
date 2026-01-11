package dev.compila.social.repository;

import dev.compila.social.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Follow entity
 */
@Repository
public interface FollowRepository extends JpaRepository<Follow, UUID> {

    /**
     * Check if user A follows user B
     */
    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    /**
     * Find all followers of a user
     */
    List<Follow> findByFollowingId(UUID followingId);

    /**
     * Find all users followed by a user
     */
    List<Follow> findByFollowerId(UUID followerId);

    /**
     * Count followers for a user
     */
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followingId = :userId")
    long countFollowers(@Param("userId") UUID userId);

    /**
     * Count following for a user
     */
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followerId = :userId")
    long countFollowing(@Param("userId") UUID userId);

    /**
     * Get list of user IDs that the given user follows
     */
    @Query("SELECT f.followingId FROM Follow f WHERE f.followerId = :userId")
    List<UUID> findFollowingIds(@Param("userId") UUID userId);

    /**
     * Delete follow relationship
     */
    void deleteByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
}
