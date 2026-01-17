package dev.compila.jobs.dto;

import dev.compila.jobs.Job;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record JobResponse(
        UUID id,
        String slug,
        String companyName,
        String companyLogoUrl,
        String companyWebsite,
        String title,
        String description,
        List<String> requirements,
        List<String> benefits,
        String jobType,
        String level,
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
        Integer viewsCount,
        Integer applicationsCount,
        LocalDateTime postedAt,
        LocalDateTime expiresAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getId(),
                job.getSlug(),
                job.getCompanyName(),
                job.getCompanyLogoUrl(),
                job.getCompanyWebsite(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements() != null ? Arrays.asList(job.getRequirements()) : List.of(),
                job.getBenefits() != null ? Arrays.asList(job.getBenefits()) : List.of(),
                job.getJobType().name(),
                job.getLevel().name(),
                job.getRemote(),
                job.getLocation(),
                job.getTechnologies() != null ? Arrays.asList(job.getTechnologies()) : List.of(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency(),
                job.getApplicationUrl(),
                job.getContactEmail(),
                job.getActive(),
                job.getFeatured(),
                job.getViewsCount(),
                job.getApplicationsCount(),
                job.getPostedAt(),
                job.getExpiresAt(),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }
}
