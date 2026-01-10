package dev.compila.submission.dto;

import dev.compila.submission.Submission;
import dev.compila.submission.enums.ProgrammingLanguage;
import dev.compila.submission.enums.SubmissionStatus;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record SubmissionResponse(
    UUID id,
    UUID userId,
    UUID challengeId,
    String code,
    ProgrammingLanguage language,
    Map<String, Object> files,
    SubmissionStatus status,
    Map<String, Object> testResults,
    Integer score,
    Integer xpGained,
    Map<String, Object> aiFeedback,
    Integer executionTimeMs,
    Integer attemptNumber,
    LocalDateTime submittedAt,
    LocalDateTime createdAt
) {
    public static SubmissionResponse from(Submission submission) {
        return new SubmissionResponse(
            submission.getId(),
            submission.getUserId(),
            submission.getChallengeId(),
            submission.getCode(),
            submission.getLanguage(),
            submission.getFiles(),
            submission.getStatus(),
            submission.getTestResults(),
            submission.getScore(),
            submission.getXpGained(),
            submission.getAiFeedback(),
            submission.getExecutionTimeMs(),
            submission.getAttemptNumber(),
            submission.getSubmittedAt(),
            submission.getCreatedAt()
        );
    }
}
