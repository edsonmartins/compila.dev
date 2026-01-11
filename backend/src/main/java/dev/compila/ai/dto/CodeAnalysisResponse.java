package dev.compila.ai.dto;

import java.util.List;

public record CodeAnalysisResponse(
        Integer score,
        String summary,
        List<CodeIssue> issues,
        List<Suggestion> suggestions,
        ComplexityMetrics complexity
) {
    public record CodeIssue(
            String severity,
            String category,
            String message,
            Integer line,
            Integer column
    ) {}

    public record Suggestion(
            String type,
            String message,
            String improvedCode
    ) {}

    public record ComplexityMetrics(
            Integer cyclomaticComplexity,
            Integer linesOfCode,
            Integer cognitiveComplexity
    ) {}
}
