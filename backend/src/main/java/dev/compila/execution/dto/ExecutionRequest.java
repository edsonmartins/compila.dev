package dev.compila.execution.dto;

import java.util.Map;

public record ExecutionRequest(
        String code,
        String language,
        String input,
        ExecutionConstraints constraints,
        Map<String, String> environmentVariables
) {
    public record ExecutionConstraints(
            Integer timeoutSeconds,
            Integer maxMemoryMb,
            Integer maxCpuCores
    ) {
        public static ExecutionConstraints defaultConstraints() {
            return new ExecutionConstraints(10, 256, 1);
        }
    }
}
