package dev.compila.execution.language;

import dev.compila.execution.dto.ExecutionRequest;
import dev.compila.execution.dto.ExecutionResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * JavaScript code executor using Node.js
 */
@Component
public class JavaScriptExecutor implements CodeExecutor {

    private static final Logger log = LoggerFactory.getLogger(JavaScriptExecutor.class);

    @Override
    public String getLanguage() {
        return "JAVASCRIPT";
    }

    @Override
    public String getFileExtension() {
        return ".js";
    }

    @Override
    public ExecutionResult execute(ExecutionRequest request) {
        try {
            // Create temporary file for code
            Path tempFile = Files.createTempFile("code_", getFileExtension());
            Files.writeString(tempFile, request.code());

            try {
                // Build command
                ProcessBuilder builder = new ProcessBuilder(
                        "node",
                        tempFile.toString()
                );

                // Redirect error stream
                builder.redirectErrorStream(true);

                log.debug("Executing JavaScript code from file: {}", tempFile);

                // Start process
                long startTime = System.currentTimeMillis();
                Process process = builder.start();

                // Set timeout
                int timeoutSeconds = request.constraints() != null
                        ? request.constraints().timeoutSeconds()
                        : 10;

                boolean finished = process.waitFor(timeoutSeconds, java.util.concurrent.TimeUnit.SECONDS);

                if (!finished) {
                    process.destroyForcibly();
                    return ExecutionResult.timeout();
                }

                long executionTime = System.currentTimeMillis() - startTime;

                // Read output
                String output = new String(process.getInputStream().readAllBytes());
                int exitCode = process.exitValue();

                if (exitCode == 0) {
                    return ExecutionResult.success(output, executionTime);
                } else {
                    return ExecutionResult.runtimeError(output, output);
                }

            } finally {
                // Clean up temp file
                Files.deleteIfExists(tempFile);
            }

        } catch (IOException e) {
            log.error("Failed to execute JavaScript code", e);
            return ExecutionResult.error("Failed to execute: " + e.getMessage(), ExecutionResult.ExecutionStatus.INTERNAL_ERROR);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ExecutionResult.error("Execution interrupted", ExecutionResult.ExecutionStatus.INTERNAL_ERROR);
        }
    }

    @Override
    public ValidationResult validate(String code) {
        // Basic syntax validation - Node.js will catch syntax errors at runtime
        try {
            ProcessBuilder builder = new ProcessBuilder(
                    "node",
                    "--check",
                    "-"
            );

            Process process = builder.start();
            process.getOutputStream().write(code.getBytes());
            process.getOutputStream().close();

            boolean finished = process.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return ValidationResult.failure("Syntax validation timeout");
            }

            if (process.exitValue() == 0) {
                return ValidationResult.success();
            }

            String error = new String(process.getErrorStream().readAllBytes());
            return ValidationResult.failure(error);

        } catch (Exception e) {
            log.warn("Failed to validate JavaScript syntax", e);
            return ValidationResult.success();
        }
    }
}
