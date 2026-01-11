package dev.compila.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
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
     */
    public CodeEvaluationResponse evaluateCode(CodeEvaluationRequest request) {
        if (!config.isEnabled()) {
            log.debug("AI service is disabled, returning mock response");
            return createMockEvaluationResponse();
        }

        try {
            return webClient.post()
                    .uri("/api/evaluate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CodeEvaluationResponse.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));
        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return createErrorEvaluationResponse("Service temporarily unavailable");
        } catch (Exception e) {
            log.error("Failed to call AI service", e);
            return createErrorEvaluationResponse("Failed to connect to evaluation service");
        }
    }

    /**
     * Analyze code quality, security, or performance
     */
    public CodeAnalysisResponse analyzeCode(CodeAnalysisRequest request) {
        if (!config.isEnabled()) {
            log.debug("AI service is disabled, returning mock analysis");
            return createMockAnalysisResponse();
        }

        try {
            return webClient.post()
                    .uri("/api/analyze")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(CodeAnalysisResponse.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));
        } catch (WebClientResponseException e) {
            log.error("AI service returned error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return createErrorAnalysisResponse("Service temporarily unavailable");
        } catch (Exception e) {
            log.error("Failed to call AI service", e);
            return createErrorAnalysisResponse("Failed to connect to analysis service");
        }
    }

    /**
     * Generate a hint for a coding challenge without giving away the solution
     */
    public String generateHint(String problemStatement, String userCode, String language) {
        if (!config.isEnabled()) {
            return "AI hints are currently disabled.";
        }

        try {
            HintRequest request = new HintRequest(problemStatement, userCode, language);
            HintResponse response = webClient.post()
                    .uri("/api/hint")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(HintResponse.class)
                    .block(Duration.ofMillis(config.getTimeout().toMillis()));

            return response != null ? response.hint() : "Unable to generate hint at this time.";
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
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .map("OK"::equals)
                    .block(Duration.ofSeconds(5));
        } catch (Exception e) {
            log.warn("AI service health check failed", e);
            return false;
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

    private record HintRequest(
            String problemStatement,
            String userCode,
            String language
    ) {}

    private record HintResponse(String hint) {}
}
