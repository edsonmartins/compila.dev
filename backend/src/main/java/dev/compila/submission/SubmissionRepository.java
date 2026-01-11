package dev.compila.submission;

import dev.compila.submission.enums.SubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for Submission entity
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    @Query("SELECT s FROM Submission s WHERE s.userId = :userId ORDER BY s.submittedAt DESC")
    Page<Submission> findByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT s FROM Submission s WHERE s.challengeId = :challengeId ORDER BY s.submittedAt DESC")
    Page<Submission> findByChallengeId(@Param("challengeId") UUID challengeId, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.userId = :userId AND s.challengeId = :challengeId")
    long countByUserIdAndChallengeId(@Param("userId") UUID userId, @Param("challengeId") UUID challengeId);

    @Query("SELECT s FROM Submission s WHERE s.userId = :userId AND s.challengeId = :challengeId ORDER BY s.submittedAt DESC")
    java.util.List<Submission> findLatestByUserAndChallenge(@Param("userId") UUID userId, @Param("challengeId") UUID challengeId);

    long countByStatus(SubmissionStatus status);
}
