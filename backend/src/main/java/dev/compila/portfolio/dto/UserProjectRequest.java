package dev.compila.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UserProjectRequest(
        @NotBlank
        @Size(max = 200)
        String title,
        String description,
        @Size(max = 300)
        String shortDescription,
        String projectUrl,
        String repositoryUrl,
        String demoUrl,
        String coverImageUrl,
        List<String> technologies,
        List<String> tags,
        Boolean featured,
        Boolean publicProject
) {}
