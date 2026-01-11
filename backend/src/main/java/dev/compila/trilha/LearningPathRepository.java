package dev.compila.trilha;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, UUID> {

    Optional<LearningPath> findBySlug(String slug);

    List<LearningPath> findByStack(LearningPath.ChallengeStack stack);

    @Query("SELECT lp FROM LearningPath lp WHERE lp.featured = true ORDER BY lp.enrolledCount DESC")
    List<LearningPath> findFeatured();

    @Query("SELECT lp FROM LearningPath lp ORDER BY lp.enrolledCount DESC")
    List<LearningPath> findAllByPopularity();
}
