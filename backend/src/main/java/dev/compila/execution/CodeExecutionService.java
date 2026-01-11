package dev.compila.execution;

import dev.compila.execution.config.ExecutionConfig;
import dev.compila.execution.dto.ExecutionRequest;
import dev.compila.execution.dto.ExecutionResult;
import dev.compila.execution.language.CodeExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Main code execution service
 */
@Service
public class CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionService.class);

    private final Map<String, CodeExecutor> executors;
    private final ExecutionConfig config;

    public CodeExecutionService(List<CodeExecutor> executors, ExecutionConfig config) {
        this.executors = executors.stream()
                .collect(Collectors.toMap(
                        CodeExecutor::getLanguage,
                        Function.identity()
                ));
        this.config = config;
        log.info("Loaded executors for languages: {}", this.executors.keySet());
    }

    /**
     * Execute code in the specified language
     */
    public ExecutionResult execute(ExecutionRequest request) {
        if (!config.isEnabled()) {
            log.debug("Code execution is disabled");
            return ExecutionResult.error("Code execution is disabled", ExecutionResult.ExecutionStatus.INTERNAL_ERROR);
        }

        // Find executor for language
        CodeExecutor executor = executors.get(request.language());
        if (executor == null) {
            log.warn("No executor found for language: {}", request.language());
            return ExecutionResult.error(
                    "Unsupported language: " + request.language(),
                    ExecutionResult.ExecutionStatus.INTERNAL_ERROR
            );
        }

        log.debug("Executing {} code", request.language());

        try {
            return executor.execute(request);
        } catch (Exception e) {
            log.error("Execution failed for language: " + request.language(), e);
            return ExecutionResult.error(
                    "Execution failed: " + e.getMessage(),
                    ExecutionResult.ExecutionStatus.INTERNAL_ERROR
            );
        }
    }

    /**
     * Validate code syntax without executing
     */
    public CodeExecutor.ValidationResult validate(String language, String code) {
        CodeExecutor executor = executors.get(language);
        if (executor == null) {
            return CodeExecutor.ValidationResult.failure("Unsupported language: " + language);
        }

        try {
            return executor.validate(code);
        } catch (Exception e) {
            log.error("Validation failed for language: " + language, e);
            return CodeExecutor.ValidationResult.failure("Validation failed: " + e.getMessage());
        }
    }

    /**
     * Check if a language is supported
     */
    public boolean isSupported(String language) {
        return executors.containsKey(language);
    }

    /**
     * Get list of supported languages
     */
    public List<String> getSupportedLanguages() {
        return List.copyOf(executors.keySet());
    }
}
