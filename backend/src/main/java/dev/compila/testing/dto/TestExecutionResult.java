package dev.compila.testing.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TestExecutionResult(
        String challengeId,
        String submissionId,
        boolean passed,
        int totalTests,
        int passedTests,
        int failedTests,
        List<TestCaseResult> results,
        int score,
        long totalExecutionTimeMs,
        LocalDateTime executedAt,
        String errorMessage
) {
    public record TestCaseResult(
            String testCaseId,
            String testCaseName,
            boolean passed,
            String expectedOutput,
            String actualOutput,
            String errorMessage,
            long executionTimeMs,
            boolean isHidden
    ) {
        public static TestCaseResult passed(String id, String name, long timeMs, boolean isHidden) {
            return new TestCaseResult(id, name, true, null, null, null, timeMs, isHidden);
        }

        public static TestCaseResult failed(String id, String name, String expected, String actual, long timeMs, boolean isHidden) {
            return new TestCaseResult(id, name, false, expected, actual, "Output mismatch", timeMs, isHidden);
        }

        public static TestCaseResult error(String id, String name, String error, long timeMs, boolean isHidden) {
            return new TestCaseResult(id, name, false, null, null, error, timeMs, isHidden);
        }
    }

    public static TestExecutionResult success(String challengeId, String submissionId, List<TestCaseResult> results, long totalTime) {
        long passedCount = results.stream().filter(TestCaseResult::passed).count();
        return new TestExecutionResult(
                challengeId,
                submissionId,
                passedCount == results.size(),
                results.size(),
                (int) passedCount,
                (int) (results.size() - passedCount),
                results,
                (int) ((passedCount * 100) / results.size()),
                totalTime,
                LocalDateTime.now(),
                null
        );
    }

    public static TestExecutionResult failure(String challengeId, String submissionId, String error) {
        return new TestExecutionResult(
                challengeId,
                submissionId,
                false,
                0,
                0,
                0,
                List.of(),
                0,
                0,
                LocalDateTime.now(),
                error
        );
    }
}
