package dev.compila.submission;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.compila.ai.AiEvaluationService;
import dev.compila.ai.dto.CodeEvaluationRequest;
import dev.compila.ai.dto.CodeEvaluationResponse;
import dev.compila.challenge.Challenge;
import dev.compila.challenge.ChallengeRepository;
import dev.compila.submission.dto.SubmitRequest;
import dev.compila.submission.dto.SubmissionResponse;
import dev.compila.submission.enums.SubmissionStatus;
import dev.compila.social.service.SocialTriggerService;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import dev.compila.submission.enums.ProgrammingLanguage;
import dev.compila.user.enums.TechnologyType;
import dev.compila.user.service.UserSkillService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.UUID;

@Service
public class SubmissionService {

    private static final Logger log = LoggerFactory.getLogger(SubmissionService.class);

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final AiEvaluationService aiEvaluationService;
    private final ObjectMapper objectMapper;
    private final SocialTriggerService socialTriggerService;
    private final UserSkillService userSkillService;
    private static final TypeReference<List<Map<String, Object>>> TEST_RESULTS_TYPE =
            new TypeReference<>() {};

    public SubmissionService(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            ChallengeRepository challengeRepository,
            AiEvaluationService aiEvaluationService,
            ObjectMapper objectMapper,
            SocialTriggerService socialTriggerService,
            UserSkillService userSkillService
    ) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.aiEvaluationService = aiEvaluationService;
        this.objectMapper = objectMapper;
        this.socialTriggerService = socialTriggerService;
        this.userSkillService = userSkillService;
    }

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

        // Trigger async AI evaluation
        evaluateSubmissionAsync(submission.getId(), submission, challenge);

        return SubmissionResponse.from(submission);
    }

    @Async
    public void evaluateSubmissionAsync(UUID submissionId, Submission submission, Challenge challenge) {
        try {
            // Parse challenge requirements to get test cases
            Map<String, Object> requirements = objectMapper.readValue(
                    challenge.getRequirements() != null ? challenge.getRequirements() : "{}",
                    objectMapper.getTypeFactory().constructMapType(Map.class, String.class, Object.class)
            );

            // Extract test cases from requirements
            List<String> testCases = extractTestCases(requirements);
            String expectedOutput = extractExpectedOutput(requirements);

            // Build evaluation request
            CodeEvaluationRequest.EvaluationConstraints constraints = new CodeEvaluationRequest.EvaluationConstraints(
                    256, // maxMemoryMb
                    10,  // maxTimeSeconds
                    null  // allowedImports
            );

            CodeEvaluationRequest evaluationRequest = new CodeEvaluationRequest(
                    submission.getCode(),
                    submission.getLanguage().name(),
                    challenge.getDescription(),
                    testCases,
                    expectedOutput,
                    constraints
            );

            // Call AI evaluation service
            CodeEvaluationResponse evaluation = aiEvaluationService.evaluateCode(evaluationRequest);

            // Update submission with results
            SubmissionStatus status = evaluation.passed() ? SubmissionStatus.PASSED : SubmissionStatus.FAILED;
            int score = evaluation.score() != null ? evaluation.score() : 0;
            int xpGained = evaluation.passed() ? challenge.getXpReward() : 0;

            List<Map<String, Object>> testResultsPayload = objectMapper.convertValue(
                    evaluation.testResults(),
                    TEST_RESULTS_TYPE
            );

            updateStatus(submissionId, status, score, xpGained, testResultsPayload);

        } catch (Exception e) {
            // Mark as failed on error
            updateStatus(submissionId, SubmissionStatus.FAILED, 0, 0, null);
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> extractTestCases(Map<String, Object> requirements) {
        Object tests = requirements.get("testCases");
        if (tests instanceof List) {
            return (List<String>) tests;
        }
        return List.of();
    }

    private String extractExpectedOutput(Map<String, Object> requirements) {
        Object output = requirements.get("expectedOutput");
        return output != null ? output.toString() : null;
    }

    @Transactional
    public SubmissionResponse updateStatus(UUID id, SubmissionStatus status, Integer score, Integer xpGained, List<Map<String, Object>> testResults) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found: " + id));

        submission.setStatus(status);
        submission.setScore(score);
        submission.setXpGained(xpGained != null ? xpGained : 0);

        // Parse test results if provided
        if (testResults != null) {
            submission.setTestResults(testResults);
        }

        submission = submissionRepository.save(submission);

        // If passed, increment challenge completed count and user XP
        if (status == SubmissionStatus.PASSED) {
            challengeRepository.incrementCompletedCount(submission.getChallengeId());

            Challenge challenge = challengeRepository.findById(submission.getChallengeId())
                    .orElseThrow(() -> new RuntimeException("Challenge not found"));

            User user = userRepository.findById(submission.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setXp(user.getXp() + submission.getXpGained());

            // Calculate level (every 1000 XP = 1 level)
            int newLevel = 1 + (int) (user.getXp() / 1000);
            user.setLevel(newLevel);

            userRepository.save(user);

            // Add/update verified skill based on challenge technology
            TechnologyType technology = mapChallengeLanguageToTechnology(submission.getLanguage());
            if (technology != null) {
                try {
                    userSkillService.addOrUpdateVerifiedSkill(submission.getUserId(), technology);
                    log.info("Added verified skill {} for user {}", technology, submission.getUserId());
                } catch (Exception e) {
                    log.warn("Failed to add verified skill: {}", e.getMessage());
                }
            }

            // Trigger automatic social post if enabled
            try {
                socialTriggerService.triggerChallengeShare(
                        submission.getUserId(),
                        submission.getChallengeId(),
                        challenge.getTitle(),
                        submission.getXpGained()
                );
            } catch (Exception e) {
                log.warn("Failed to trigger challenge share: {}", e.getMessage());
            }
        }

        return SubmissionResponse.from(submission);
    }

    /**
     * Map submission language to TechnologyType for user skills
     */
    private TechnologyType mapChallengeLanguageToTechnology(ProgrammingLanguage language) {
        if (language == null) return null;

        return switch (language) {
            case JAVA -> TechnologyType.JAVA;
            case PYTHON -> TechnologyType.PYTHON;
            case JAVASCRIPT -> TechnologyType.JAVASCRIPT;
            case TYPESCRIPT -> TechnologyType.TYPESCRIPT;
            case GO -> TechnologyType.GO;
            case RUST -> TechnologyType.RUST;
            case C_SHARP -> TechnologyType.DOTNET;
            case PHP -> TechnologyType.PHP;
            case KOTLIN -> TechnologyType.KOTLIN;
            case SWIFT -> TechnologyType.SWIFT;
            case RUBY -> TechnologyType.RUBY;
            case DART -> TechnologyType.FLUTTER;
            case CPLUSPLUS -> null; // Could add C++ to TechnologyType
            case OTHER -> null;
        };
    }
}
