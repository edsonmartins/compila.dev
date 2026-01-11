package dev.compila.ai.dto;

public record CodeAnalysisRequest(
        String code,
        String language,
        String analysisType
) {
    public enum AnalysisType {
        QUALITY,
        SECURITY,
        PERFORMANCE,
        BEST_PRACTICES,
        COMPLETENESS
    }
}
