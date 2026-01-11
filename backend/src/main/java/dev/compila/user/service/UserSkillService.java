package dev.compila.user.service;

import dev.compila.user.entity.UserSkill;
import dev.compila.user.enums.ProficiencyLevel;
import dev.compila.user.enums.TechnologyType;
import dev.compila.user.repository.UserSkillRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for managing user skills and technology stack
 */
@Service
public class UserSkillService {

    private final UserSkillRepository userSkillRepository;

    public UserSkillService(UserSkillRepository userSkillRepository) {
        this.userSkillRepository = userSkillRepository;
    }

    /**
     * Get all skills for a user
     */
    public List<UserSkill> getUserSkills(UUID userId) {
        return userSkillRepository.findByUserId(userId);
    }

    /**
     * Get verified skills (from challenges) for a user
     */
    public List<UserSkill> getVerifiedSkills(UUID userId) {
        return userSkillRepository.findVerifiedSkillsByUserId(userId);
    }

    /**
     * Get manually added skills for a user
     */
    public List<UserSkill> getManualSkills(UUID userId) {
        return userSkillRepository.findManualSkillsByUserId(userId);
    }

    /**
     * Get skills grouped by category
     */
    public List<UserSkill> getSkillsByCategory(UUID userId, String category) {
        return userSkillRepository.findByUserId(userId).stream()
                .filter(skill -> skill.getTechnology().getCategory().equals(category))
                .toList();
    }

    /**
     * Get a specific skill for a user
     */
    public UserSkill getUserSkill(UUID userId, TechnologyType technology) {
        return userSkillRepository.findByUserIdAndTechnology(userId, technology)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found"));
    }

    /**
     * Add a skill manually (not verified)
     * If skill already exists, update proficiency level
     */
    @Transactional
    public UserSkill addManualSkill(UUID userId, TechnologyType technology, ProficiencyLevel proficiencyLevel) {
        return userSkillRepository.findByUserIdAndTechnology(userId, technology)
                .map(existingSkill -> {
                    // Update existing skill if it was manually added
                    if (!existingSkill.getIsVerified()) {
                        existingSkill.setProficiencyLevel(proficiencyLevel);
                        return userSkillRepository.save(existingSkill);
                    }
                    // Don't update verified skills
                    return existingSkill;
                })
                .orElseGet(() -> {
                    UserSkill newSkill = new UserSkill(userId, technology, proficiencyLevel, false);
                    return userSkillRepository.save(newSkill);
                });
    }

    /**
     * Add or update a skill from challenge completion (verified)
     * This is called automatically when a user completes a challenge
     */
    @Transactional
    public UserSkill addOrUpdateVerifiedSkill(UUID userId, TechnologyType technology) {
        return userSkillRepository.findByUserIdAndTechnology(userId, technology)
                .map(existingSkill -> {
                    existingSkill.incrementChallengeCount();
                    existingSkill.setIsVerified(true);
                    return userSkillRepository.save(existingSkill);
                })
                .orElseGet(() -> {
                    UserSkill newSkill = new UserSkill(userId, technology, ProficiencyLevel.BEGINNER, true);
                    newSkill.setChallengesCount(1);
                    return userSkillRepository.save(newSkill);
                });
    }

    /**
     * Update proficiency level of a manual skill
     * Cannot update verified skills (they are based on challenges)
     */
    @Transactional
    public UserSkill updateSkillLevel(UUID userId, TechnologyType technology, ProficiencyLevel newLevel) {
        UserSkill skill = getUserSkill(userId, technology);

        if (skill.getIsVerified()) {
            throw new IllegalArgumentException("Cannot update verified skill. Complete more challenges to improve.");
        }

        skill.setProficiencyLevel(newLevel);
        return userSkillRepository.save(skill);
    }

    /**
     * Remove a manual skill
     * Cannot remove verified skills
     */
    @Transactional
    public void removeSkill(UUID userId, TechnologyType technology) {
        UserSkill skill = getUserSkill(userId, technology);

        if (skill.getIsVerified()) {
            throw new IllegalArgumentException("Cannot remove verified skill. It was earned through challenges.");
        }

        userSkillRepository.deleteByUserIdAndTechnology(userId, technology);
    }

    /**
     * Get skill statistics for a user
     */
    public SkillStats getSkillStats(UUID userId) {
        List<UserSkill> allSkills = userSkillRepository.findByUserId(userId);
        long verifiedCount = userSkillRepository.countVerifiedSkillsByUserId(userId);

        return new SkillStats(
                allSkills.size(),
                (int) verifiedCount,
                allSkills.size() - (int) verifiedCount,
                getSkillsByCategory(userId, "frontend").size(),
                getSkillsByCategory(userId, "backend").size(),
                getSkillsByCategory(userId, "mobile").size(),
                getSkillsByCategory(userId, "devops").size(),
                getSkillsByCategory(userId, "database").size()
        );
    }

    /**
     * Check if user has a specific technology
     */
    public boolean hasSkill(UUID userId, TechnologyType technology) {
        return userSkillRepository.existsByUserIdAndTechnology(userId, technology);
    }

    /**
     * Record for skill statistics
     */
    public record SkillStats(
            int totalSkills,
            int verifiedSkills,
            int manualSkills,
            int frontendSkills,
            int backendSkills,
            int mobileSkills,
            int devopsSkills,
            int databaseSkills
    ) {}
}
