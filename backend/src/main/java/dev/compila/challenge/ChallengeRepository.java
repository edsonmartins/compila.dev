package dev.compila.challenge;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Challenge entity
 */
@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {

    Optional<Challenge> findBySlug(String slug);

    Page<Challenge> findByStackAndPublishedTrue(ChallengeStack stack, Pageable pageable);

    Page<Challenge> findByLevelAndPublishedTrue(ChallengeLevel level, Pageable pageable);

    Page<Challenge> findByTechnologiesContainingAndPublishedTrue(String technology, Pageable pageable);

    Page<Challenge> findByTitleContainingIgnoreCaseAndPublishedTrue(String title, Pageable pageable);

    Page<Challenge> findAllByPublishedTrue(Pageable pageable);

    @Query("SELECT c FROM Challenge c WHERE c.published = true ORDER BY c.createdAt DESC")
    List<Challenge> findAllPublished();

    @Query("SELECT c FROM Challenge c WHERE c.published = true AND c.featured = true")
    List<Challenge> findFeaturedChallenges();

    @Query("SELECT c FROM Challenge c WHERE c.stack = :stack AND c.published = true ORDER BY c.createdAt DESC")
    List<Challenge> findByStackPublished(@Param("stack") ChallengeStack stack);

    @Query("SELECT c FROM Challenge c WHERE c.level = :level AND c.published = true ORDER BY c.createdAt DESC")
    List<Challenge> findByLevelPublished(@Param("level") ChallengeLevel level);
}
