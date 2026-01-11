package dev.compila.testing.dto;

import java.util.List;

public record TestSuite(
        String challengeId,
        String challengeTitle,
        List<TestCase> testCases,
        TestConstraints constraints,
        String setupCode,
        String teardownCode
) {
    public record TestConstraints(
            int timeoutSeconds,
            int maxMemoryMb,
            int maxCpuCores
    ) {
        public static TestConstraints defaults() {
            return new TestConstraints(10, 256, 1);
        }
    }
}
