package dev.compila.ai;

import dev.compila.ai.dto.CodeAnalysisRequest;
import dev.compila.ai.dto.CodeAnalysisResponse;
import dev.compila.ai.dto.CodeEvaluationRequest;
import dev.compila.ai.dto.CodeEvaluationResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiEvaluationService aiEvaluationService;

    public AiController(AiEvaluationService aiEvaluationService) {
        this.aiEvaluationService = aiEvaluationService;
    }

    @PostMapping("/evaluate")
    public ResponseEntity<CodeEvaluationResponse> evaluateCode(
            @Valid @RequestBody CodeEvaluationRequest request) {
        CodeEvaluationResponse response = aiEvaluationService.evaluateCode(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/analyze")
    public ResponseEntity<CodeAnalysisResponse> analyzeCode(
            @Valid @RequestBody CodeAnalysisRequest request) {
        CodeAnalysisResponse response = aiEvaluationService.analyzeCode(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean isHealthy = aiEvaluationService.isHealthy();
        return ResponseEntity.ok(Map.of(
                "status", isHealthy ? "UP" : "DOWN",
                "enabled", true
        ));
    }
}
