package dev.compila.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.compila.ai.config.AiServiceConfig;
import dev.compila.ai.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;

@Service
public class AiEvaluationService {

    private static final Logger log = LoggerFactory.getLogger(AiEvaluationService.class);
    private static final String COMPILA_API_PREFIX = "/api/v1/compila";

    private final WebClient webClient;
    private final AiServiceConfig config;
    private final ObjectMapper objectMapper;

    public AiEvaluationService(AiServiceConfig config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;

        this.webClient = WebClient.builder()
                .baseUrl(config.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Evaluate code submission against test cases
     * Calls the AI Service's /api/v1/compila/evaluate endpoint
     */
    public CodeEvaluationResponse evaluateCode(CodeEvaluationRequest request) {
        if (!config.isEnabled()) {
            log.debug("AI service is disabled, returning mock response");
            return createMockEvaluationResponse();
        }

        try {
            // Build request body for AI Service
            AiServiceEvaluateRequest body = new AiServiceEvaluateRequest(
                    request.code(),
                    request.language(),
                    request.problemStatement(),
                    convertTestCases(request.testCases()),
                    request.constraints()
            );

            AiServiceEvaluateResponse response = webClient.post()
                    .uri(COMPILA_API_PREFIX + "/evaluate")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(AiServiceEvaluateResponse.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));

            return convertResponse(response);

        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return createErrorEvaluationResponse("Service temporarily unavailable");
        } catch (Exception e) {
            log.error("Failed to call AI service", e);
            return createErrorEvaluationResponse("Failed to connect to evaluation service");
        }
    }

    /**
     * Analyze code quality without running tests
     */
    public CodeAnalysisResponse analyzeCode(CodeAnalysisRequest request) {
        if (!config.isEnabled()) {
            log.debug("AI service is disabled, returning mock analysis");
            return createMockAnalysisResponse();
        }

        try {
            AiServiceEvaluateRequest body = new AiServiceEvaluateRequest(
                    request.code(),
                    request.language(),
                    request.code(), // Use code as problem_statement since not available
                    List.of(),
                    null
            );

            AiServiceFeedback feedback = webClient.post()
                    .uri(COMPILA_API_PREFIX + "/analyze")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(AiServiceFeedback.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));

            return new CodeAnalysisResponse(
                    feedback.overall_score(),
                    feedback.strengths().isEmpty() ? "Code submitted" : String.join(", ", feedback.strengths()),
                    List.of(), // issues - not used in new format
                    List.of(new CodeAnalysisResponse.Suggestion(
                            "improvement",
                            String.join(", ", feedback.improvements()),
                            null
                    )),
                    new CodeAnalysisResponse.ComplexityMetrics(
                            5,
                            request.code().split("\n").length,
                            3
                    )
            );

        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return createErrorAnalysisResponse("Service temporarily unavailable");
        } catch (Exception e) {
            log.error("Failed to call AI service", e);
            return createErrorAnalysisResponse("Failed to connect to analysis service");
        }
    }

    /**
     * Generate a hint for a coding challenge
     */
    public String generateHint(String problemStatement, String userCode, String language) {
        if (!config.isEnabled()) {
            return "AI hints are currently disabled.";
        }

        try {
            AiServiceEvaluateRequest body = new AiServiceEvaluateRequest(
                    userCode,
                    language,
                    problemStatement,
                    List.of(),
                    null
            );

            AiServiceFeedback feedback = webClient.post()
                    .uri(COMPILA_API_PREFIX + "/analyze")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(AiServiceFeedback.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));

            return feedback.hint() != null ? feedback.hint() : "Continue practicing!";

        } catch (Exception e) {
            log.error("Failed to generate hint", e);
            return "Unable to generate hint at this time.";
        }
    }

    /**
     * Check if the AI service is healthy
     */
    public boolean isHealthy() {
        try {
            return webClient.get()
                    .uri(COMPILA_API_PREFIX + "/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .map("OK"::equals)
                    .block(Duration.ofSeconds(5));
        } catch (Exception e) {
            log.warn("AI service health check failed", e);
            return false;
        }
    }

    private List<AiServiceTestCase> convertTestCases(List<String> testCases) {
        if (testCases == null) return List.of();
        return testCases.stream()
                .map(tc -> new AiServiceTestCase(tc, "", false))
                .toList();
    }

    private CodeEvaluationResponse convertResponse(AiServiceEvaluateResponse response) {
        List<CodeEvaluationResponse.TestResult> testResults = response.testResults().stream()
                .map(tr -> new CodeEvaluationResponse.TestResult(
                        tr.test_name(),
                        tr.passed(),
                        tr.expected_output(),
                        tr.actual_output(),
                        tr.error_message()
                ))
                .toList();

        return new CodeEvaluationResponse(
                response.success(),
                response.feedback().overall_score,
                response.feedback().strengths().isEmpty() ? "Evaluation completed" : String.join(", ", response.feedback().strengths()),
                List.of(),
                response.feedback().improvements(),
                testResults,
                response.feedback().hint
        );
    }

    // DTOs for AI Service communication
    public record AiServiceEvaluateRequest(
            String code,
            String language,
            String problem_statement,
            List<AiServiceTestCase> test_cases,
            Object constraints
    ) {}

    public record AiServiceTestCase(
            String input_data,
            String expected_output,
            boolean is_hidden
    ) {}

    public record AiServiceEvaluateResponse(
            boolean success,
            int passed_tests,
            int total_tests,
            List<AiServiceTestResult> test_results,
            AiServiceFeedback feedback,
            Integer execution_time_ms
    ) {
        public AiServiceFeedback feedback() {
            return feedback;
        }
        public List<AiServiceTestResult> testResults() {
            return test_results;
        }
        public boolean success() {
            return success;
        }
    }

    public record AiServiceTestResult(
            String test_name,
            boolean passed,
            String expected_output,
            String actual_output,
            String error_message,
            boolean is_hidden
    ) {
        public String testName() {
            return test_name;
        }
        public boolean passed() {
            return passed;
        }
        public String expectedOutput() {
            return expected_output;
        }
        public String actualOutput() {
            return actual_output;
        }
        public String errorMessage() {
            return error_message;
        }
    }

    public record AiServiceFeedback(
            int overall_score,
            List<String> strengths,
            List<String> improvements,
            List<String> best_practices,
            String complexity_analysis,
            String hint
            ) {
        public int overall_score() {
            return overall_score;
        }
        public List<String> strengths() {
            return strengths;
        }
        public List<String> improvements() {
            return improvements;
        }
    }

    private CodeEvaluationResponse createMockEvaluationResponse() {
        return new CodeEvaluationResponse(
                true,
                100,
                "Code compiled successfully",
                List.of(),
                List.of(),
                List.of(
                        new CodeEvaluationResponse.TestResult("Test 1", true, "Success", "Success", null)
                ),
                null
        );
    }

    private CodeEvaluationResponse createErrorEvaluationResponse(String errorMessage) {
        return new CodeEvaluationResponse(
                false,
                0,
                errorMessage,
                List.of(errorMessage),
                List.of(),
                List.of(),
                "Please try again later"
        );
    }

    private CodeAnalysisResponse createMockAnalysisResponse() {
        return new CodeAnalysisResponse(
                85,
                "Code appears to be well-structured",
                List.of(),
                List.of(
                        new CodeAnalysisResponse.Suggestion(
                                "optimization",
                                "Consider using more efficient data structures",
                                null
                        )
                ),
                new CodeAnalysisResponse.ComplexityMetrics(5, 50, 3)
        );
    }

    private CodeAnalysisResponse createErrorAnalysisResponse(String errorMessage) {
        return new CodeAnalysisResponse(
                0,
                errorMessage,
                List.of(),
                List.of(),
                new CodeAnalysisResponse.ComplexityMetrics(0, 0, 0)
        );
    }
}
