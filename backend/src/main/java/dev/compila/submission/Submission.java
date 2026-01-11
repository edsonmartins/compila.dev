package dev.compila.submission;

import dev.compila.common.BaseEntity;
import dev.compila.submission.enums.ProgrammingLanguage;
import dev.compila.submission.enums.SubmissionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcTypeCode;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Submission entity
 */
@Entity
@Table(name = "submissions")
public class Submission extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "challenge_id", nullable = false)
    private UUID challengeId;

    @NotBlank
    @Lob
    @Column(nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false, length = 20)
    private ProgrammingLanguage language;

    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> files;

    // Result
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> testResults;

    @Column
    private Integer score;

    @Column(name = "xp_gained")
    private Integer xpGained = 0;

    // AI Feedback
    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> aiFeedback;

    @Column(name = "ai_tokens_used")
    private Integer aiTokensUsed;

    // Timing
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;

    // Version (for resubmissions)
    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber = 1;

    // Constructors
    public Submission() {}

    public Submission(UUID userId, UUID challengeId) {
        this.userId = userId;
        this.challengeId = challengeId;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(UUID challengeId) {
        this.challengeId = challengeId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public ProgrammingLanguage getLanguage() {
        return language;
    }

    public void setLanguage(ProgrammingLanguage language) {
        this.language = language;
    }

    public Map<String, Object> getFiles() {
        return files;
    }

    public void setFiles(Map<String, Object> files) {
        this.files = files;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public Map<String, Object> getTestResults() {
        return testResults;
    }

    public void setTestResults(Map<String, Object> testResults) {
        this.testResults = testResults;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getXpGained() {
        return xpGained;
    }

    public void setXpGained(Integer xpGained) {
        this.xpGained = xpGained;
    }

    public Map<String, Object> getAiFeedback() {
        return aiFeedback;
    }

    public void setAiFeedback(Map<String, Object> aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public Integer getAiTokensUsed() {
        return aiTokensUsed;
    }

    public void setAiTokensUsed(Integer aiTokensUsed) {
        this.aiTokensUsed = aiTokensUsed;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Integer executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }
}
