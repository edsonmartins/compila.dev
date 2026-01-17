package dev.compila.jobs;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.jobs.dto.JobApplicationRequest;
import dev.compila.jobs.dto.JobApplicationResponse;
import dev.compila.jobs.dto.JobRequest;
import dev.compila.jobs.dto.JobResponse;
import dev.compila.jobs.enums.JobLevel;
import dev.compila.jobs.enums.JobType;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> list(
            @RequestParam(required = false) JobType type,
            @RequestParam(required = false) JobLevel level,
            @RequestParam(required = false) Boolean remote,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "postedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(jobService.listJobs(type, level, remote, featured, search, pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<JobResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(jobService.getBySlug(slug));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<JobResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody JobRequest request
    ) {
        return ResponseEntity.ok(jobService.create(request, userDetails.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody JobRequest request
    ) {
        return ResponseEntity.ok(jobService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        jobService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<JobApplicationResponse> apply(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody JobApplicationRequest request
    ) {
        return ResponseEntity.ok(jobService.apply(id, userDetails.getId(), request));
    }
}
