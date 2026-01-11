package dev.compila.user.entity;

import dev.compila.common.BaseEntity;
import dev.compila.user.enums.ProficiencyLevel;
import dev.compila.user.enums.TechnologyType;
import jakarta.persistence.*;

/**
 * UserSkill entity - tracks technologies and skills for each user
 * Skills can be automatically verified via challenges or manually added
 */
@Entity
@Table(name = "user_skills",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_technology", columnNames = {"user_id", "technology"})
    }
)
public class UserSkill extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private java.util.UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "technology", nullable = false, length = 50)
    private TechnologyType technology;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level", nullable = false, length = 20)
    private ProficiencyLevel proficiencyLevel;

    /**
     * Whether this skill was verified through completing a challenge
     * Skills marked as verified have a "verified" badge on the profile
     */
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    /**
     * Number of challenges completed with this technology
     * Used to determine proficiency level
     */
    @Column(name = "challenges_count")
    private Integer challengesCount = 0;

    // Constructors
    public UserSkill() {
    }

    public UserSkill(java.util.UUID userId, TechnologyType technology, ProficiencyLevel proficiencyLevel) {
        this.userId = userId;
        this.technology = technology;
        this.proficiencyLevel = proficiencyLevel;
        this.isVerified = false;
        this.challengesCount = 0;
    }

    public UserSkill(java.util.UUID userId, TechnologyType technology, ProficiencyLevel proficiencyLevel, Boolean isVerified) {
        this.userId = userId;
        this.technology = technology;
        this.proficiencyLevel = proficiencyLevel;
        this.isVerified = isVerified;
        this.challengesCount = 0;
    }

    // Getters and Setters
    public java.util.UUID getUserId() {
        return userId;
    }

    public void setUserId(java.util.UUID userId) {
        this.userId = userId;
    }

    public TechnologyType getTechnology() {
        return technology;
    }

    public void setTechnology(TechnologyType technology) {
        this.technology = technology;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Integer getChallengesCount() {
        return challengesCount;
    }

    public void setChallengesCount(Integer challengesCount) {
        this.challengesCount = challengesCount;
    }

    /**
     * Increment the challenge count and potentially upgrade proficiency level
     */
    public void incrementChallengeCount() {
        this.challengesCount = (this.challengesCount != null ? this.challengesCount : 0) + 1;
        updateProficiencyLevelBasedOnChallenges();
    }

    /**
     * Automatically update proficiency level based on challenges completed
     * 1-3 challenges: BEGINNER
     * 4-7 challenges: INTERMEDIATE
     * 8+ challenges: ADVANCED
     */
    private void updateProficiencyLevelBasedOnChallenges() {
        if (challengesCount >= 8) {
            this.proficiencyLevel = ProficiencyLevel.ADVANCED;
        } else if (challengesCount >= 4) {
            this.proficiencyLevel = ProficiencyLevel.INTERMEDIATE;
        } else if (challengesCount >= 1) {
            this.proficiencyLevel = ProficiencyLevel.BEGINNER;
        }
    }
}
