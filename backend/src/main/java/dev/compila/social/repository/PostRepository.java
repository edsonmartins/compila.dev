package dev.compila.social.repository;

import dev.compila.social.entity.Post;
import dev.compila.social.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for Post entity
 */
@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    /**
     * Find published posts ordered by created date descending
     */
    Page<Post> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Find trending posts based on kudos engagement
     */
    @Query("SELECT p FROM Post p WHERE p.published = true ORDER BY " +
           "((p.fireCount * 5.0) + (p.rocketCount * 5.0) + (p.cleanCount * 4.0) + " +
           "(p.lightbulbCount * 3.0) + (p.targetCount * 3.0) + (p.pairCount * 2.0)) / " +
           "FUNCTION('AGE', HOUR, p.publishedAt, p.createdAt) / 24.0 + 1.0) DESC")
    Page<Post> findTrending(Pageable pageable);

    /**
     * Find posts by user
     */
    Page<Post> findByUserIdAndPublishedTrueOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    /**
     * Find posts by type
     */
    Page<Post> findByTypeAndPublishedTrueOrderByCreatedAtDesc(PostType type, Pageable pageable);

    /**
     * Find unsolved questions
     */
    Page<Post> findByTypeAndIsSolvedFalseAndPublishedTrueOrderByCreatedAtDesc(
            PostType type, Pageable pageable);

    /**
     * Find posts from followed users
     */
    @Query("SELECT p FROM Post p WHERE p.userId IN :followedUserIds AND p.published = true " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findFeedFromFollowedUsers(@Param("followedUserIds") List<UUID> followedUserIds, Pageable pageable);

    /**
     * Find posts containing code snippets
     */
    @Query("SELECT p FROM Post p WHERE p.codeSnippet IS NOT NULL AND p.published = true " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findPostsWithSnippets(Pageable pageable);

    /**
     * Search posts by content
     */
    @Query("SELECT p FROM Post p WHERE p.published = true AND " +
           "(LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CAST(p.metadata AS text)) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> searchPosts(@Param("query") String query, Pageable pageable);

    /**
     * Find posts by challenge ID
     */
    List<Post> findByChallengeId(UUID challengeId);

    /**
     * Find posts by badge ID
     */
    List<Post> findByBadgeId(UUID badgeId);

    /**
     * Count posts by user
     */
    long countByUserIdAndPublishedTrue(UUID userId);

    /**
     * Increment comment count for a post
     */
    @Query("UPDATE Post p SET p.commentCount = p.commentCount + 1 WHERE p.id = :postId")
    void incrementCommentCount(@Param("postId") UUID postId);

    /**
     * Decrement comment count for a post
     */
    @Query("UPDATE Post p SET p.commentCount = p.commentCount - 1 WHERE p.id = :postId AND p.commentCount > 0")
    void decrementCommentCount(@Param("postId") UUID postId);

    /**
     * Increment view count
     */
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :postId")
    void incrementViewCount(@Param("postId") UUID postId);

    /**
     * Increment a specific kudo count
     */
    @Query("UPDATE Post p SET " +
           "p.fireCount = CASE WHEN :kudoType = 'FIRE' THEN p.fireCount + 1 ELSE p.fireCount END, " +
           "p.rocketCount = CASE WHEN :kudoType = 'ROCKET' THEN p.rocketCount + 1 ELSE p.rocketCount END, " +
           "p.lightbulbCount = CASE WHEN :kudoType = 'LIGHTBULB' THEN p.lightbulbCount + 1 ELSE p.lightbulbCount END, " +
           "p.cleanCount = CASE WHEN :kudoType = 'CLEAN' THEN p.cleanCount + 1 ELSE p.cleanCount END, " +
           "p.targetCount = CASE WHEN :kudoType = 'TARGET' THEN p.targetCount + 1 ELSE p.targetCount END, " +
           "p.pairCount = CASE WHEN :kudoType = 'PAIR' THEN p.pairCount + 1 ELSE p.pairCount END " +
           "WHERE p.id = :postId")
    void incrementKudoCount(@Param("postId") UUID postId, @Param("kudoType") String kudoType);

    /**
     * Decrement a specific kudo count
     */
    @Query("UPDATE Post p SET " +
           "p.fireCount = CASE WHEN :kudoType = 'FIRE' THEN GREATEST(p.fireCount - 1, 0) ELSE p.fireCount END, " +
           "p.rocketCount = CASE WHEN :kudoType = 'ROCKET' THEN GREATEST(p.rocketCount - 1, 0) ELSE p.rocketCount END, " +
           "p.lightbulbCount = CASE WHEN :kudoType = 'LIGHTBULB' THEN GREATEST(p.lightbulbCount - 1, 0) ELSE p.lightbulbCount END, " +
           "p.cleanCount = CASE WHEN :kudoType = 'CLEAN' THEN GREATEST(p.cleanCount - 1, 0) ELSE p.cleanCount END, " +
           "p.targetCount = CASE WHEN :kudoType = 'TARGET' THEN GREATEST(p.targetCount - 1, 0) ELSE p.targetCount END, " +
           "p.pairCount = CASE WHEN :kudoType = 'PAIR' THEN GREATEST(p.pairCount - 1, 0) ELSE p.pairCount END " +
           "WHERE p.id = :postId")
    void decrementKudoCount(@Param("postId") UUID postId, @Param("kudoType") String kudoType);

    /**
     * Mark post as solved
     */
    @Query("UPDATE Post p SET p.isSolved = true, p.solutionPostId = :solutionCommentId WHERE p.id = :postId")
    void markAsSolved(@Param("postId") UUID postId, @Param("solutionCommentId") UUID solutionCommentId);

    /**
     * Find recent posts from the last N days
     */
    @Query("SELECT p FROM Post p WHERE p.published = true AND p.createdAt >= :since ORDER BY p.createdAt DESC")
    List<Post> findRecentPosts(@Param("since") LocalDateTime since);

    /**
     * Get top posts by total kudos
     */
    @Query("SELECT p FROM Post p WHERE p.published = true ORDER BY " +
           "(p.fireCount + p.rocketCount + p.lightbulbCount + p.cleanCount + p.targetCount + p.pairCount) DESC")
    List<Post> findTopKudosPosts(Pageable pageable);
}
