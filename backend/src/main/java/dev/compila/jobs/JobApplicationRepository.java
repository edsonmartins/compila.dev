package dev.compila.jobs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    boolean existsByJobIdAndUserId(UUID jobId, UUID userId);

    Optional<JobApplication> findByJobIdAndUserId(UUID jobId, UUID userId);

    long countByJobId(UUID jobId);
}
