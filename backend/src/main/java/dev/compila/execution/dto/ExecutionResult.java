package dev.compila.execution.dto;

import java.time.LocalDateTime;

public record ExecutionResult(
        boolean success,
        String output,
        String error,
        Integer exitCode,
        Long executionTimeMs,
        Long memoryUsedMb,
        LocalDateTime executedAt,
        ExecutionStatus status,
        String stderr
) {
    public enum ExecutionStatus {
        PENDING,
        RUNNING,
        COMPLETED,
        TIMEOUT,
        MEMORY_LIMIT_EXCEEDED,
        RUNTIME_ERROR,
        COMPILATION_ERROR,
        INTERNAL_ERROR
    }

    public static ExecutionResult success(String output, long executionTimeMs) {
        return new ExecutionResult(true, output, null, 0, executionTimeMs, null, LocalDateTime.now(), ExecutionStatus.COMPLETED, null);
    }

    public static ExecutionResult error(String error, ExecutionStatus status) {
        return new ExecutionResult(false, null, error, null, null, null, LocalDateTime.now(), status, null);
    }

    public static ExecutionResult timeout() {
        return new ExecutionResult(false, null, "Execution timeout exceeded", null, null, null, LocalDateTime.now(), ExecutionStatus.TIMEOUT, null);
    }

    public static ExecutionResult compilationError(String error) {
        return new ExecutionResult(false, null, error, null, null, null, LocalDateTime.now(), ExecutionStatus.COMPILATION_ERROR, error);
    }

    public static ExecutionResult runtimeError(String error, String stderr) {
        return new ExecutionResult(false, null, error, null, null, null, LocalDateTime.now(), ExecutionStatus.RUNTIME_ERROR, stderr);
    }
}
