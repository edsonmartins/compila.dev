package dev.compila.jobs;

import dev.compila.jobs.dto.JobApplicationRequest;
import dev.compila.jobs.dto.JobApplicationResponse;
import dev.compila.jobs.dto.JobRequest;
import dev.compila.jobs.dto.JobResponse;
import dev.compila.jobs.enums.JobLevel;
import dev.compila.jobs.enums.JobType;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository
    ) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public Page<JobResponse> listJobs(
            JobType jobType,
            JobLevel level,
            Boolean remote,
            Boolean featured,
            String search,
            Pageable pageable
    ) {
        return jobRepository.findActiveFiltered(jobType, level, remote, featured, search, pageable)
                .map(JobResponse::from);
    }

    @Transactional
    public JobResponse getBySlug(String slug) {
        Job job = jobRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Job not found: " + slug));
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);
        return JobResponse.from(job);
    }

    public JobResponse getById(UUID id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));
        return JobResponse.from(job);
    }

    @Transactional
    public JobResponse create(JobRequest request, UUID postedById) {
        Job job = new Job();
        applyRequest(job, request);
        job.setPostedById(postedById);
        if (job.getPostedAt() == null) {
            job.setPostedAt(LocalDateTime.now());
        }
        return JobResponse.from(jobRepository.save(job));
    }

    @Transactional
    public JobResponse update(UUID id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));
        applyRequest(job, request);
        return JobResponse.from(jobRepository.save(job));
    }

    @Transactional
    public void delete(UUID id) {
        jobRepository.deleteById(id);
    }

    @Transactional
    public JobApplicationResponse apply(UUID jobId, UUID userId, JobApplicationRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        if (!job.getActive()) {
            throw new RuntimeException("Job is not active");
        }

        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Job has expired");
        }

        if (jobApplicationRepository.existsByJobIdAndUserId(jobId, userId)) {
            throw new RuntimeException("User already applied to this job");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setUserId(user.getId());
        application.setCoverLetter(request.coverLetter());
        application.setResumeUrl(request.resumeUrl());

        JobApplication saved = jobApplicationRepository.save(application);
        job.setApplicationsCount(job.getApplicationsCount() + 1);
        jobRepository.save(job);

        return JobApplicationResponse.from(saved);
    }

    private void applyRequest(Job job, JobRequest request) {
        job.setSlug(request.slug());
        job.setCompanyName(request.companyName());
        job.setCompanyLogoUrl(request.companyLogoUrl());
        job.setCompanyWebsite(request.companyWebsite());
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setRequirements(request.requirements() != null ? request.requirements().toArray(new String[0]) : null);
        job.setBenefits(request.benefits() != null ? request.benefits().toArray(new String[0]) : null);
        job.setJobType(request.jobType());
        job.setLevel(request.level());
        job.setRemote(request.remote() != null ? request.remote() : job.getRemote());
        job.setLocation(request.location());
        job.setTechnologies(request.technologies() != null ? request.technologies().toArray(new String[0]) : null);
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        if (request.salaryCurrency() != null) {
            job.setSalaryCurrency(request.salaryCurrency());
        }
        job.setApplicationUrl(request.applicationUrl());
        job.setContactEmail(request.contactEmail());
        if (request.active() != null) {
            job.setActive(request.active());
        }
        if (request.featured() != null) {
            job.setFeatured(request.featured());
        }
        if (request.postedAt() != null) {
            job.setPostedAt(request.postedAt());
        }
        job.setExpiresAt(request.expiresAt());
    }
}
