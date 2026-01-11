package dev.compila.testing.dto;

import java.util.List;
import java.util.Map;

public record TestCase(
        String id,
        String name,
        String description,
        String input,
        String expectedOutput,
        boolean isHidden,
        int order,
        Map<String, Object> metadata
) {
    public static TestCase visible(String id, String name, String input, String expectedOutput) {
        return new TestCase(id, name, null, input, expectedOutput, false, 0, null);
    }

    public static TestCase hidden(String id, String name, String input, String expectedOutput) {
        return new TestCase(id, name, null, input, expectedOutput, true, 0, null);
    }
}
