package dev.compila.testing;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.compila.execution.CodeExecutionService;
import dev.compila.execution.dto.ExecutionRequest;
import dev.compila.execution.dto.ExecutionResult;
import dev.compila.testing.dto.TestCase;
import dev.compila.testing.dto.TestExecutionResult;
import dev.compila.testing.dto.TestSuite;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for running test cases against submitted code
 */
@Service
public class TestRunnerService {

    private static final Logger log = LoggerFactory.getLogger(TestRunnerService.class);

    private final CodeExecutionService executionService;
    private final ObjectMapper objectMapper;

    public TestRunnerService(CodeExecutionService executionService, ObjectMapper objectMapper) {
        this.executionService = executionService;
        this.objectMapper = objectMapper;
    }

    /**
     * Run all test cases in a test suite against submitted code
     */
    public TestExecutionResult runTests(String language, String code, TestSuite testSuite, String submissionId) {
        List<TestExecutionResult.TestCaseResult> results = new ArrayList<>();
        long totalExecutionTime = 0;

        for (TestCase testCase : testSuite.testCases()) {
            try {
                // Build execution request with test case input
                ExecutionRequest request = buildExecutionRequest(
                        language,
                        code,
                        testCase,
                        testSuite
                );

                // Execute code
                long startTime = System.currentTimeMillis();
                ExecutionResult executionResult = executionService.execute(request);
                long executionTime = System.currentTimeMillis() - startTime;

                totalExecutionTime += executionTime;

                // Validate output
                if (executionResult.status() == ExecutionResult.ExecutionStatus.COMPLETED && executionResult.success()) {
                    String actualOutput = normalizeOutput(executionResult.output());
                    String expectedOutput = normalizeOutput(testCase.expectedOutput());

                    if (actualOutput.equals(expectedOutput)) {
                        results.add(TestExecutionResult.TestCaseResult.passed(
                                testCase.id(),
                                testCase.name(),
                                executionTime,
                                testCase.isHidden()
                        ));
                    } else {
                        results.add(TestExecutionResult.TestCaseResult.failed(
                                testCase.id(),
                                testCase.name(),
                                expectedOutput,
                                actualOutput,
                                executionTime,
                                testCase.isHidden()
                        ));
                    }
                } else {
                    results.add(TestExecutionResult.TestCaseResult.error(
                            testCase.id(),
                            testCase.name(),
                            executionResult.error() != null ? executionResult.error() : "Execution failed",
                            executionTime,
                            testCase.isHidden()
                    ));
                }

            } catch (Exception e) {
                log.error("Failed to execute test case: {}", testCase.id(), e);
                results.add(TestExecutionResult.TestCaseResult.error(
                        testCase.id(),
                        testCase.name(),
                        "Test execution error: " + e.getMessage(),
                        0,
                        testCase.isHidden()
                ));
            }
        }

        return TestExecutionResult.success(
                testSuite.challengeId(),
                submissionId,
                results,
                totalExecutionTime
        );
    }

    /**
     * Run a single test case
     */
    public TestExecutionResult.TestCaseResult runSingleTest(
            String language,
            String code,
            TestCase testCase,
            TestSuite.TestConstraints constraints
    ) {
        try {
            TestSuite dummySuite = new TestSuite(
                    null,
                    null,
                    List.of(testCase),
                    constraints != null ? constraints : TestSuite.TestConstraints.defaults(),
                    null,
                    null
            );

            ExecutionRequest request = buildExecutionRequest(language, code, testCase, dummySuite);
            long startTime = System.currentTimeMillis();
            ExecutionResult result = executionService.execute(request);
            long executionTime = System.currentTimeMillis() - startTime;

            if (result.status() == ExecutionResult.ExecutionStatus.COMPLETED && result.success()) {
                String actual = normalizeOutput(result.output());
                String expected = normalizeOutput(testCase.expectedOutput());

                if (actual.equals(expected)) {
                    return TestExecutionResult.TestCaseResult.passed(
                            testCase.id(),
                            testCase.name(),
                            executionTime,
                            testCase.isHidden()
                    );
                } else {
                    return TestExecutionResult.TestCaseResult.failed(
                            testCase.id(),
                            testCase.name(),
                            expected,
                            actual,
                            executionTime,
                            testCase.isHidden()
                    );
                }
            } else {
                return TestExecutionResult.TestCaseResult.error(
                        testCase.id(),
                        testCase.name(),
                        result.error() != null ? result.error() : "Execution failed",
                        executionTime,
                        testCase.isHidden()
                );
            }
        } catch (Exception e) {
            return TestExecutionResult.TestCaseResult.error(
                    testCase.id(),
                    testCase.name(),
                    "Test error: " + e.getMessage(),
                    0,
                    testCase.isHidden()
            );
        }
    }

    /**
     * Parse test suite from JSON requirements
     */
    public TestSuite parseTestSuite(String requirementsJson, String challengeId, String title) {
        try {
            if (requirementsJson == null || requirementsJson.isBlank()) {
                return emptyTestSuite(challengeId, title);
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> requirements = objectMapper.readValue(requirementsJson, Map.class);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> testCasesData = (List<Map<String, Object>>) requirements.get("testCases");

            List<TestCase> testCases = List.of();
            if (testCasesData != null) {
                testCases = testCasesData.stream()
                        .map(this::mapToTestCase)
                        .collect(Collectors.toList());
            }

            TestSuite.TestConstraints constraints = TestSuite.TestConstraints.defaults();
            if (requirements.containsKey("timeout")) {
                int timeout = ((Number) requirements.get("timeout")).intValue();
                constraints = new TestSuite.TestConstraints(timeout, 256, 1);
            }

            return new TestSuite(
                    challengeId,
                    title,
                    testCases,
                    constraints,
                    (String) requirements.get("setupCode"),
                    (String) requirements.get("teardownCode")
            );

        } catch (Exception e) {
            log.warn("Failed to parse test suite, using empty one", e);
            return emptyTestSuite(challengeId, title);
        }
    }

    private TestCase mapToTestCase(Map<String, Object> data) {
        return new TestCase(
                (String) data.get("id"),
                (String) data.get("name"),
                (String) data.get("description"),
                (String) data.get("input"),
                (String) data.get("expectedOutput"),
                Boolean.TRUE.equals(data.get("hidden")),
                data.containsKey("order") ? ((Number) data.get("order")).intValue() : 0,
                (Map<String, Object>) data.get("metadata")
        );
    }

    private TestSuite emptyTestSuite(String challengeId, String title) {
        return new TestSuite(
                challengeId,
                title,
                List.of(),
                TestSuite.TestConstraints.defaults(),
                null,
                null
        );
    }

    private ExecutionRequest buildExecutionRequest(
            String language,
            String code,
            TestCase testCase,
            TestSuite testSuite
    ) {
        // Combine setup, user code, and teardown
        String fullCode = buildFullCode(code, testSuite);

        // Convert TestConstraints to ExecutionConstraints
        TestSuite.TestConstraints source = testSuite.constraints();
        ExecutionRequest.ExecutionConstraints constraints = new ExecutionRequest.ExecutionConstraints(
                source.timeoutSeconds(),
                source.maxMemoryMb(),
                source.maxCpuCores()
        );

        return new ExecutionRequest(
                fullCode,
                language,
                testCase.input(),
                constraints,
                null
        );
    }

    private String buildFullCode(String userCode, TestSuite testSuite) {
        StringBuilder fullCode = new StringBuilder();

        if (testSuite.setupCode() != null && !testSuite.setupCode().isBlank()) {
            fullCode.append(testSuite.setupCode()).append("\n");
        }

        fullCode.append(userCode);

        if (testSuite.teardownCode() != null && !testSuite.teardownCode().isBlank()) {
            fullCode.append("\n").append(testSuite.teardownCode());
        }

        return fullCode.toString();
    }

    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }
        // Trim whitespace and normalize line endings
        return output.trim().replaceAll("\\r\\n?", "\n");
    }
}
