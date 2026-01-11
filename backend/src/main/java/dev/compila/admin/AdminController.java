package dev.compila.admin;

import dev.compila.admin.dto.AdminDashboardStats;
import dev.compila.challenge.ChallengeRepository;
import dev.compila.gamification.GamificationService;
import dev.compila.submission.SubmissionRepository;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;
    private final GamificationService gamificationService;

    public AdminController(
            UserRepository userRepository,
            ChallengeRepository challengeRepository,
            SubmissionRepository submissionRepository,
            GamificationService gamificationService
    ) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.submissionRepository = submissionRepository;
        this.gamificationService = gamificationService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        // Get basic counts
        long totalUsers = userRepository.count();
        long totalChallenges = challengeRepository.count();
        long totalSubmissions = submissionRepository.count();

        // Calculate active users (logged in within last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeUsers = userRepository.countByLastActiveAtAfter(thirtyDaysAgo);

        // Get top users
        List<AdminDashboardStats.TopUser> topUsers = gamificationService.getRanking(5).stream()
                .map(ranking -> new AdminDashboardStats.TopUser(
                        ranking.id().toString(),
                        ranking.username(),
                        ranking.fullName(),
                        ranking.avatarUrl(),
                        ranking.xp(),
                        ranking.level(),
                        0 // TODO: Add completed challenges count to ranking
                ))
                .collect(Collectors.toList());

        // Calculate success rate
        double successRate = 0.0;
        long passedCount = submissionRepository.countByStatus(dev.compila.submission.enums.SubmissionStatus.PASSED);
        if (totalSubmissions > 0) {
            successRate = (passedCount * 100.0) / totalSubmissions;
        }

        // Recent activities (mock for now - would need an activity log table)
        List<AdminDashboardStats.RecentActivity> recentActivities = List.of();

        AdminDashboardStats stats = new AdminDashboardStats(
                totalUsers,
                activeUsers,
                totalChallenges,
                totalSubmissions,
                Math.round(successRate * 10.0) / 10.0,
                25L, // TODO: Calculate real average
                topUsers,
                recentActivities
        );

        return ResponseEntity.ok(stats);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        // TODO: Implement pagination
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Challenge Management
    @GetMapping("/challenges")
    public ResponseEntity<List<?>> getAllChallenges() {
        // TODO: Return challenge list
        return ResponseEntity.ok(challengeRepository.findAll());
    }
}
