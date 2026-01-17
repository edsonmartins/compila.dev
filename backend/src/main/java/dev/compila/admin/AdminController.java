package dev.compila.admin;

import dev.compila.admin.dto.*;
import dev.compila.challenge.Challenge;
import dev.compila.challenge.ChallengeRepository;
import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import dev.compila.gamification.GamificationService;
import dev.compila.social.entity.Post;
import dev.compila.social.repository.PostRepository;
import dev.compila.submission.SubmissionRepository;
import dev.compila.submission.enums.SubmissionStatus;
import dev.compila.user.User;
import dev.compila.user.User.SubscriptionPlan;
import dev.compila.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;
    private final GamificationService gamificationService;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserRepository userRepository,
            ChallengeRepository challengeRepository,
            SubmissionRepository submissionRepository,
            GamificationService gamificationService,
            PostRepository postRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.submissionRepository = submissionRepository;
        this.gamificationService = gamificationService;
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalChallenges = challengeRepository.count();
        long totalSubmissions = submissionRepository.count();

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeUsers = userRepository.countByLastActiveAtAfter(thirtyDaysAgo);

        List<AdminDashboardStats.TopUser> topUsers = gamificationService.getRanking(5).stream()
                .map(ranking -> new AdminDashboardStats.TopUser(
                        ranking.id().toString(),
                        ranking.username(),
                        ranking.fullName(),
                        ranking.avatarUrl(),
                        ranking.xp(),
                        ranking.level(),
                        0
                ))
                .collect(Collectors.toList());

        double successRate = 0.0;
        long passedCount = submissionRepository.countByStatus(SubmissionStatus.PASSED);
        if (totalSubmissions > 0) {
            successRate = (passedCount * 100.0) / totalSubmissions;
        }

        List<AdminDashboardStats.RecentActivity> recentActivities = getRecentActivities(10);

        AdminDashboardStats stats = new AdminDashboardStats(
                totalUsers,
                activeUsers,
                totalChallenges,
                totalSubmissions,
                Math.round(successRate * 10.0) / 10.0,
                25L,
                topUsers,
                recentActivities
        );

        return ResponseEntity.ok(stats);
    }

    // ==================== User Management ====================

    @GetMapping("/users")
    public ResponseEntity<AdminUsersResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage = userRepository.findAll(pageable);

        List<AdminUserDTO> userDTOs = userPage.getContent().stream()
                .map(this::mapToAdminUserDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AdminUsersResponse(userDTOs, userPage.getTotalElements()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(mapToAdminUserDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<AdminUserDTO> toggleUserStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> request
    ) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(request.getOrDefault("enabled", !user.getEnabled()));
                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(mapToAdminUserDTO(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public ResponseEntity<AdminUserDTO> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEnabled(true);
        user.setEmailVerified(false);
        if (request.subscription() != null) {
            user.setSubscriptionPlan(SubscriptionPlan.valueOf(request.subscription()));
        }
        user.setLevel(request.level() != null ? request.level() : 1);
        user.setXp(request.xp() != null ? request.xp() : 0L);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(mapToAdminUserDTO(saved));
    }

    // ==================== Challenge Management ====================

    @GetMapping("/challenges")
    public ResponseEntity<List<AdminChallengeDTO>> getAllChallenges() {
        return ResponseEntity.ok(challengeRepository.findAll().stream()
                .map(this::mapToAdminChallengeDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/challenges/{id}")
    public ResponseEntity<AdminChallengeDTO> getChallengeById(@PathVariable UUID id) {
        return challengeRepository.findById(id)
                .map(challenge -> ResponseEntity.ok(mapToAdminChallengeDTO(challenge)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/challenges/{id}/publish")
    public ResponseEntity<AdminChallengeDTO> toggleChallengePublish(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> request
    ) {
        return challengeRepository.findById(id)
                .map(challenge -> {
                    challenge.setPublished(request.getOrDefault("published", !challenge.getPublished()));
                    Challenge saved = challengeRepository.save(challenge);
                    return ResponseEntity.ok(mapToAdminChallengeDTO(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/challenges/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable UUID id) {
        if (challengeRepository.existsById(id)) {
            challengeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/challenges")
    public ResponseEntity<AdminChallengeDTO> createChallenge(@RequestBody CreateChallengeRequest request) {
        Challenge challenge = new Challenge();
        challenge.setTitle(request.title());
        challenge.setDescription(request.description());
        challenge.setLevel(ChallengeLevel.valueOf(request.difficulty()));
        challenge.setStack(ChallengeStack.valueOf(request.stack()));
        challenge.setXpReward(request.xpReward());
        challenge.setPublished(request.published() != null ? request.published() : false);
        challenge.setRequirements(request.requirements());
        challenge.setStarterCode(request.startingCode());

        Challenge saved = challengeRepository.save(challenge);
        return ResponseEntity.ok(mapToAdminChallengeDTO(saved));
    }

    // ==================== Moderation ====================

    @GetMapping("/moderation/posts")
    public ResponseEntity<Page<AdminModerationItemDTO>> getReportedPosts(
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Filter posts based on status - for now return all posts with pagination
        // TODO: Add proper status filtering when Post entity has report status
        return ResponseEntity.ok(postRepository.findAll(pageable)
                .map(this::mapToModerationItemDTO));
    }

    @DeleteMapping("/moderation/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ==================== Helper Methods ====================

    private AdminUserDTO mapToAdminUserDTO(User user) {
        return new AdminUserDTO(
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                "USER", // Default role since User entity doesn't have a role field
                user.getEnabled(),
                user.getEmailVerified(),
                user.getLevel(),
                user.getXp(),
                user.getStreakCurrent(),
                user.getSubscriptionPlan() != null ? user.getSubscriptionPlan().name() : "FREE",
                user.getCreatedAt().toString(),
                user.getLastActiveAt() != null ? user.getLastActiveAt().toString() : null,
                getCompletedChallengesCount(user.getId())
        );
    }

    private AdminChallengeDTO mapToAdminChallengeDTO(Challenge challenge) {
        return new AdminChallengeDTO(
                challenge.getId().toString(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getLevel().name(),
                challenge.getStack().name(),
                challenge.getXpReward(),
                challenge.getPublished(),
                challenge.getCreatedAt().toString(),
                challenge.getCompletedCount() != null ? challenge.getCompletedCount() : 0,
                challenge.getSuccessRate() != null ? challenge.getSuccessRate().doubleValue() : 0.0
        );
    }

    private AdminModerationItemDTO mapToModerationItemDTO(Post post) {
        return new AdminModerationItemDTO(
                post.getId().toString(),
                "POST",
                post.getContent(),
                new AdminModerationItemDTO.Author(
                        post.getUserId().toString(),
                        null, // username - would need join with User table
                        null, // fullName - would need join with User table
                        null  // avatarUrl - would need join with User table
                ),
                "APPROVED",
                null,
                null,
                post.getCreatedAt().toString(),
                new AdminModerationItemDTO.Metadata(
                        post.getType().name(),
                        post.getCodeSnippet() != null
                )
        );
    }

    private int getCompletedChallengesCount(UUID userId) {
        return (int) submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.PASSED);
    }

    private int getCompletionCount(UUID challengeId) {
        return (int) submissionRepository.countByChallengeIdAndStatus(challengeId, SubmissionStatus.PASSED);
    }

    private double getSuccessRate(UUID challengeId) {
        long total = submissionRepository.countByChallengeId(challengeId);
        long passed = submissionRepository.countByChallengeIdAndStatus(challengeId, SubmissionStatus.PASSED);
        return total > 0 ? (passed * 100.0) / total : 0.0;
    }

    private List<AdminDashboardStats.RecentActivity> getRecentActivities(int limit) {
        return List.of(
                new AdminDashboardStats.RecentActivity(
                        UUID.randomUUID().toString(),
                        "user_registered",
                        "João Silva se registrou na plataforma",
                        "João Silva",
                        "https://i.pravatar.cc/150?img=1",
                        LocalDateTime.now().minusHours(2).toString()
                ),
                new AdminDashboardStats.RecentActivity(
                        UUID.randomUUID().toString(),
                        "challenge_completed",
                        "Maria completou o desafio Todo List",
                        "Maria Santos",
                        "https://i.pravatar.cc/150?img=2",
                        LocalDateTime.now().minusHours(4).toString()
                ),
                new AdminDashboardStats.RecentActivity(
                        UUID.randomUUID().toString(),
                        "post",
                        "Pedro compartilhou um snippet de código",
                        "Pedro Costa",
                        "https://i.pravatar.cc/150?img=3",
                        LocalDateTime.now().minusDays(1).toString()
                )
        );
    }
}
