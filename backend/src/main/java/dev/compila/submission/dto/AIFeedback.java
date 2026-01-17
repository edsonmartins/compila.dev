package dev.compila.submission.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Typed DTO for AI feedback data.
 * Contains structured feedback from AI code analysis.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AIFeedback {
    @JsonProperty("score")
    private Integer score;

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("strengths")
    private List<String> strengths;

    @JsonProperty("improvements")
    private List<String> improvements;

    @JsonProperty("suggestions")
    private List<String> suggestions;

    @JsonProperty("complexity")
    private String complexity;

    @JsonProperty("readability")
    private String readability;

    @JsonProperty("bestPractices")
    private List<String> bestPractices;

    // Default constructor
    public AIFeedback() {
    }

    // Full constructor
    public AIFeedback(Integer score, String summary, List<String> strengths,
                      List<String> improvements, List<String> suggestions,
                      String complexity, String readability, List<String> bestPractices) {
        this.score = score;
        this.summary = summary;
        this.strengths = strengths;
        this.improvements = improvements;
        this.suggestions = suggestions;
        this.complexity = complexity;
        this.readability = readability;
        this.bestPractices = bestPractices;
    }

    public static AIFeedback of(Integer score, String summary) {
        return new AIFeedback(
                score,
                summary,
                List.of(),
                List.of(),
                List.of(),
                null,
                null,
                List.of()
        );
    }

    public static AIFeedback detailed(Integer score, String summary,
                                       List<String> strengths, List<String> improvements) {
        return new AIFeedback(
                score,
                summary,
                strengths,
                improvements,
                List.of(),
                null,
                null,
                List.of()
        );
    }

    // Getters and Setters
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public String getComplexity() { return complexity; }
    public void setComplexity(String complexity) { this.complexity = complexity; }

    public String getReadability() { return readability; }
    public void setReadability(String readability) { this.readability = readability; }

    public List<String> getBestPractices() { return bestPractices; }
    public void setBestPractices(List<String> bestPractices) { this.bestPractices = bestPractices; }
}
