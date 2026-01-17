package dev.compila.jobs.dto;

import dev.compila.jobs.enums.JobLevel;
import dev.compila.jobs.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record JobRequest(
        @NotBlank
        @Size(max = 100)
        String slug,
        @NotBlank
        @Size(max = 200)
        String companyName,
        String companyLogoUrl,
        String companyWebsite,
        @NotBlank
        @Size(max = 200)
        String title,
        @NotBlank
        String description,
        List<String> requirements,
        List<String> benefits,
        @NotNull
        JobType jobType,
        @NotNull
        JobLevel level,
        Boolean remote,
        String location,
        List<String> technologies,
        Integer salaryMin,
        Integer salaryMax,
        String salaryCurrency,
        String applicationUrl,
        String contactEmail,
        Boolean active,
        Boolean featured,
        LocalDateTime postedAt,
        LocalDateTime expiresAt
) {}
