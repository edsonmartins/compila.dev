package dev.compila.submission.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Typed DTO for test result data.
 * Represents the result of a single test case execution.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestResult {
    @JsonProperty("testId")
    private String testId;

    @JsonProperty("testName")
    private String testName;

    @JsonProperty("passed")
    private boolean passed;

    @JsonProperty("message")
    private String message;

    @JsonProperty("duration")
    private Long duration;

    @JsonProperty("output")
    private String output;

    @JsonProperty("expectedOutput")
    private String expectedOutput;

    // Default constructor
    public TestResult() {
    }

    // Full constructor
    public TestResult(String testId, String testName, boolean passed, String message,
                      Long duration, String output, String expectedOutput) {
        this.testId = testId;
        this.testName = testName;
        this.passed = passed;
        this.message = message;
        this.duration = duration;
        this.output = output;
        this.expectedOutput = expectedOutput;
    }

    public static TestResult passed(String testId, String testName) {
        return new TestResult(testId, testName, true, null, null, null, null);
    }

    public static TestResult failed(String testId, String testName, String message) {
        return new TestResult(testId, testName, false, message, null, null, null);
    }

    public static TestResult of(String testId, String testName, boolean passed, String message) {
        return new TestResult(testId, testName, passed, message, null, null, null);
    }

    // Getters and Setters
    public String getTestId() { return testId; }
    public void setTestId(String testId) { this.testId = testId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getDuration() { return duration; }
    public void setDuration(Long duration) { this.duration = duration; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
}
