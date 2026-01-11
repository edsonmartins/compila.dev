package dev.compila.user.repository;

import dev.compila.user.entity.UserSkill;
import dev.compila.user.enums.TechnologyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for UserSkill entity
 */
@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {

    /**
     * Find all skills for a user
     */
    List<UserSkill> findByUserId(UUID userId);

    /**
     * Find a specific skill for a user
     */
    Optional<UserSkill> findByUserIdAndTechnology(UUID userId, TechnologyType technology);

    /**
     * Check if user has a specific technology
     */
    boolean existsByUserIdAndTechnology(UUID userId, TechnologyType technology);

    /**
     * Find verified skills for a user
     */
    @Query("SELECT us FROM UserSkill us WHERE us.userId = :userId AND us.isVerified = true")
    List<UserSkill> findVerifiedSkillsByUserId(@Param("userId") UUID userId);

    /**
     * Find manually added skills for a user
     */
    @Query("SELECT us FROM UserSkill us WHERE us.userId = :userId AND us.isVerified = false")
    List<UserSkill> findManualSkillsByUserId(@Param("userId") UUID userId);

    /**
     * Count verified skills for a user
     */
    @Query("SELECT COUNT(us) FROM UserSkill us WHERE us.userId = :userId AND us.isVerified = true")
    long countVerifiedSkillsByUserId(@Param("userId") UUID userId);

    /**
     * Delete a user's skill
     */
    void deleteByUserIdAndTechnology(UUID userId, TechnologyType technology);
}
