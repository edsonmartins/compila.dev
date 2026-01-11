package dev.compila.execution.language;

import dev.compila.execution.dto.ExecutionRequest;
import dev.compila.execution.dto.ExecutionResult;

import java.util.List;

/**
 * Interface for language-specific code executors
 */
public interface CodeExecutor {

    /**
     * Get the language this executor supports
     */
    String getLanguage();

    /**
     * Execute code with the given input
     */
    ExecutionResult execute(ExecutionRequest request);

    /**
     * Validate code syntax without executing
     */
    ValidationResult validate(String code);

    /**
     * Get the file extension for this language
     */
    String getFileExtension();

    /**
     * Result of code validation
     */
    record ValidationResult(
            boolean valid,
            List<String> errors,
            List<String> warnings
    ) {
        public static ValidationResult success() {
            return new ValidationResult(true, List.of(), List.of());
        }

        public static ValidationResult failure(String error) {
            return new ValidationResult(false, List.of(error), List.of());
        }
    }
}
