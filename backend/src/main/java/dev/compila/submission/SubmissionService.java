package dev.compila.submission;

import dev.compila.challenge.Challenge;
import dev.compila.challenge.ChallengeRepository;
import dev.compila.submission.dto.SubmitRequest;
import dev.compila.submission.dto.SubmissionResponse;
import dev.compila.submission.enums.SubmissionStatus;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    public Page<SubmissionResponse> findByUserId(UUID userId, Pageable pageable) {
        return submissionRepository.findByUserId(userId, pageable)
                .map(SubmissionResponse::from);
    }

    public Page<SubmissionResponse> findByChallengeId(UUID challengeId, Pageable pageable) {
        return submissionRepository.findByChallengeId(challengeId, pageable)
                .map(SubmissionResponse::from);
    }

    public List<SubmissionResponse> findLatestByUserAndChallenge(UUID userId, UUID challengeId) {
        return submissionRepository.findLatestByUserAndChallenge(userId, challengeId).stream()
                .map(SubmissionResponse::from)
                .toList();
    }

    public SubmissionResponse findById(UUID id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));
        return SubmissionResponse.from(submission);
    }

    @Transactional
    public SubmissionResponse submit(UUID userId, SubmitRequest request) {
        // Validate user and challenge exist
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Challenge challenge = challengeRepository.findById(request.challengeId())
                .orElseThrow(() -> new RuntimeException("Challenge not found: " + request.challengeId()));

        // Calculate attempt number
        long attemptNumber = submissionRepository.countByUserIdAndChallengeId(userId, request.challengeId()) + 1;

        // Create submission
        Submission submission = new Submission(userId, request.challengeId());
        submission.setCode(request.code());
        submission.setLanguage(request.language());
        submission.setFiles(request.files());
        submission.setStatus(SubmissionStatus.PENDING);
        submission.setAttemptNumber((int) attemptNumber);
        submission.setSubmittedAt(LocalDateTime.now());

        submission = submissionRepository.save(submission);

        // Increment challenge attempted count
        challengeRepository.incrementAttemptedCount(request.challengeId());

        // TODO: Execute tests asynchronously
        // This will be integrated with the AI service

        return SubmissionResponse.from(submission);
    }

    @Transactional
    public SubmissionResponse updateStatus(UUID id, SubmissionStatus status, Integer score, Integer xpGained, String testResults) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));

        submission.setStatus(status);
        submission.setScore(score);
        submission.setXpGained(xpGained != null ? xpGained : 0);

        // Parse test results if provided
        if (testResults != null) {
            // TODO: Parse JSON test results
            submission.setTestResults(null);
        }

        submission = submissionRepository.save(submission);

        // If passed, increment challenge completed count and user XP
        if (status == SubmissionStatus.PASSED) {
            challengeRepository.incrementCompletedCount(submission.getChallengeId());

            User user = userRepository.findById(submission.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setXp(user.getXp() + submission.getXpGained());

            // Calculate level (every 1000 XP = 1 level)
            int newLevel = 1 + (int) (user.getXp() / 1000);
            user.setLevel(newLevel);

            userRepository.save(user);
        }

        return SubmissionResponse.from(submission);
    }
}
