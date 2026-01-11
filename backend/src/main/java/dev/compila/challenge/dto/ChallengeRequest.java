package dev.compila.challenge.dto;

import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public record ChallengeRequest(
    @NotBlank
    @Size(max = 100)
    String slug,

    @NotBlank
    @Size(max = 200)
    String title,

    @Size(max = 300)
    String shortDescription,

    @NotBlank
    String description,

    @NotNull
    ChallengeStack stack,

    @NotNull
    ChallengeLevel level,

    @NotNull
    Integer difficulty,

    List<String> technologies,
    List<String> tags,

    Map<String, Object> requirements,
    Map<String, String> starterCode,
    Map<String, String> solutionCode,

    @NotNull
    Integer xpReward,

    Integer estimatedTimeMinutes,
    List<String> badges,

    Boolean published,
    Boolean featured
) {}
