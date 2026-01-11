package dev.compila.execution;

import dev.compila.execution.dto.ExecutionRequest;
import dev.compila.execution.dto.ExecutionResult;
import dev.compila.execution.language.CodeExecutor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/execution")
@CrossOrigin(origins = "*")
public class ExecutionController {

    private final CodeExecutionService executionService;

    public ExecutionController(CodeExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping("/execute")
    public ResponseEntity<ExecutionResult> execute(@Valid @RequestBody ExecutionRequest request) {
        // Set default constraints if not provided
        ExecutionRequest enrichedRequest = new ExecutionRequest(
                request.code(),
                request.language(),
                request.input(),
                request.constraints() != null ? request.constraints() : ExecutionRequest.ExecutionConstraints.defaultConstraints(),
                request.environmentVariables()
        );

        ExecutionResult result = executionService.execute(enrichedRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/validate")
    public ResponseEntity<CodeExecutor.ValidationResult> validate(
            @RequestParam String language,
            @RequestBody String code
    ) {
        CodeExecutor.ValidationResult result = executionService.validate(language, code);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/languages")
    public ResponseEntity<List<String>> getSupportedLanguages() {
        return ResponseEntity.ok(executionService.getSupportedLanguages());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "enabled", true,
                "languages", executionService.getSupportedLanguages()
        ));
    }
}
