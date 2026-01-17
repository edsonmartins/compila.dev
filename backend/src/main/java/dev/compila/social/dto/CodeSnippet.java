package dev.compila.social.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Typed DTO for code snippet data stored in Post entity.
 * Replaces Map<String, Object> for type safety.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CodeSnippet {
    @JsonProperty("language")
    private String language;

    @JsonProperty("code")
    private String code;

    @JsonProperty("lineHighlights")
    private List<Integer> lineHighlights;

    @JsonProperty("description")
    private String description;

    // Default constructor for JSON deserialization
    public CodeSnippet() {
    }

    // Full constructor
    public CodeSnippet(String language, String code, List<Integer> lineHighlights, String description) {
        this.language = language;
        this.code = code;
        this.lineHighlights = lineHighlights;
        this.description = description;
    }

    /**
     * Creates a CodeSnippet with minimal required fields.
     */
    public static CodeSnippet of(String language, String code) {
        return new CodeSnippet(language, code, List.of(), null);
    }

    /**
     * Creates a CodeSnippet with all fields.
     */
    public static CodeSnippet of(String language, String code, List<Integer> lineHighlights, String description) {
        return new CodeSnippet(language, code, lineHighlights, description);
    }

    // Getters and Setters
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<Integer> getLineHighlights() {
        return lineHighlights;
    }

    public void setLineHighlights(List<Integer> lineHighlights) {
        this.lineHighlights = lineHighlights;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
