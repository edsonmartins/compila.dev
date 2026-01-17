package dev.compila.jobs.dto;

import dev.compila.jobs.JobApplication;

import java.time.LocalDateTime;
import java.util.UUID;

public record JobApplicationResponse(
        UUID id,
        UUID jobId,
        UUID userId,
        String status,
        LocalDateTime appliedAt
) {
    public static JobApplicationResponse from(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getJobId(),
                application.getUserId(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
}
