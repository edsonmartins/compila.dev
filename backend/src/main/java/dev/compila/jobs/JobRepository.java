package dev.compila.jobs;

import dev.compila.jobs.enums.JobLevel;
import dev.compila.jobs.enums.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {

    Optional<Job> findBySlug(String slug);

    @Query("""
        SELECT j FROM Job j
        WHERE j.active = true
          AND (:jobType IS NULL OR j.jobType = :jobType)
          AND (:level IS NULL OR j.level = :level)
          AND (:remote IS NULL OR j.remote = :remote)
          AND (:featured IS NULL OR j.featured = :featured)
          AND (
            :search IS NULL OR
            LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """)
    Page<Job> findActiveFiltered(
            @Param("jobType") JobType jobType,
            @Param("level") JobLevel level,
            @Param("remote") Boolean remote,
            @Param("featured") Boolean featured,
            @Param("search") String search,
            Pageable pageable
    );
}
