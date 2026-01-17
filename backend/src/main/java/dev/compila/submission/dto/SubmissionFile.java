package dev.compila.submission.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Typed DTO for submission file data.
 * Represents a single file in a multi-file submission.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionFile {
    @JsonProperty("filename")
    private String filename;

    @JsonProperty("content")
    private String content;

    @JsonProperty("language")
    private String language;

    @JsonProperty("size")
    private Long size;

    // Default constructor
    public SubmissionFile() {
    }

    // Full constructor
    public SubmissionFile(String filename, String content, String language, Long size) {
        this.filename = filename;
        this.content = content;
        this.language = language;
        this.size = size;
    }

    public static SubmissionFile of(String filename, String content, String language) {
        return new SubmissionFile(filename, content, language, (long) content.length());
    }

    // Getters and Setters
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }
}
