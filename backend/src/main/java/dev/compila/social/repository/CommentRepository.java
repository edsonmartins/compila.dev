package dev.compila.social.repository;

import dev.compila.social.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Comment entity
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    /**
     * Find comments by post (top-level only, no parent)
     */
    Page<Comment> findByPostIdAndParentIdIsNullOrderByCreatedAtAsc(UUID postId, Pageable pageable);

    /**
     * Find replies to a comment
     */
    Page<Comment> findByParentIdOrderByCreatedAtAsc(UUID parentId, Pageable pageable);

    /**
     * Find all comments for a post (including replies)
     */
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId ORDER BY c.createdAt ASC")
    List<Comment> findAllByPostIdOrderByCreatedAtAsc(@Param("postId") UUID postId);

    /**
     * Find solution comment for a post
     */
    Comment findByPostIdAndIsSolutionTrue(UUID postId);

    /**
     * Count comments by post
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.postId = :postId AND c.isDeleted = false")
    long countActiveByPostId(@Param("postId") UUID postId);

    /**
     * Count replies for a comment
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentId = :commentId AND c.isDeleted = false")
    long countReplies(@Param("commentId") UUID commentId);

    /**
     * Count solutions provided by user
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.userId = :userId AND c.isSolution = true")
    long countSolutionsByUserId(@Param("userId") UUID userId);

    /**
     * Find top-level comments by user
     */
    Page<Comment> findByUserIdAndParentIdIsNullOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
