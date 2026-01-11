package dev.compila.ai.dto;

import java.util.List;

public record CodeEvaluationRequest(
        String code,
        String language,
        String problemStatement,
        List<String> testCases,
        String expectedOutput,
        EvaluationConstraints constraints
) {
    public record EvaluationConstraints(
            Integer maxMemoryMb,
            Integer maxTimeSeconds,
            List<String> allowedImports
    ) {}
}
