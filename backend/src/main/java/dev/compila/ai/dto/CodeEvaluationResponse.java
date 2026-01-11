package dev.compila.ai.dto;

import java.util.List;

public record CodeEvaluationResponse(
        boolean passed,
        Integer score,
        String feedback,
        List<String> errors,
        List<String> warnings,
        List<TestResult> testResults,
        String suggestion
) {
    public record TestResult(
            String testName,
            boolean passed,
            String output,
            String expectedOutput,
            String errorMessage
    ) {}
}
