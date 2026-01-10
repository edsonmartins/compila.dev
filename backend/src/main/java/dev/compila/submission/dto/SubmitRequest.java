package dev.compila.submission.dto;

import dev.compila.submission.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

public record SubmitRequest(
    @NotNull
    UUID challengeId,

    @NotBlank
    String code,

    @NotNull
    ProgrammingLanguage language,

    Map<String, Object> files
) {}
