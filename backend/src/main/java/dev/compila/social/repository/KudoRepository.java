package dev.compila.social.repository;

import dev.compila.social.entity.Kudo;
import dev.compila.social.enums.KudoType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Kudo entity
 */
@Repository
public interface KudoRepository extends JpaRepository<Kudo, UUID> {

    /**
     * Find a kudo by user and post
     */
    Optional<Kudo> findByUserIdAndPostId(UUID userId, UUID postId);

    /**
     * Find all kudos for a post
     */
    List<Kudo> findByPostId(UUID postId);

    /**
     * Find all kudos by a user
     */
    List<Kudo> findByUserId(UUID userId);

    /**
     * Count kudos for a post
     */
    @Query("SELECT COUNT(k) FROM Kudo k WHERE k.postId = :postId AND k.isActive = true")
    long countActiveKudosByPostId(@Param("postId") UUID postId);

    /**
     * Count kudos by type for a post
     */
    @Query("SELECT COUNT(k) FROM Kudo k WHERE k.postId = :postId AND k.kudoType = :kudoType AND k.isActive = true")
    long countByPostIdAndKudoType(@Param("postId") UUID postId, @Param("kudoType") KudoType kudoType);

    /**
     * Delete all kudos by post
     */
    void deleteByPostId(UUID postId);

    /**
     * Count total kudos given by user
     */
    @Query("SELECT COUNT(k) FROM Kudo k WHERE k.userId = :userId AND k.isActive = true")
    long countActiveKudosByUserId(@Param("userId") UUID userId);

    /**
     * Count kudos received by user
     */
    @Query("SELECT COUNT(k) FROM Kudo k JOIN Post p ON k.postId = p.id WHERE p.userId = :userId AND k.isActive = true")
    long countKudosReceivedByUserId(@Param("userId") UUID userId);
}
