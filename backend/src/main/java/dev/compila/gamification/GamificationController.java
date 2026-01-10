package dev.compila.gamification;

import dev.compila.gamification.dto.BadgeResponse;
import dev.compila.gamification.dto.UserStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/gamification")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable UUID userId) {
        return ResponseEntity.ok(gamificationService.getUserStats(userId));
    }

    @GetMapping("/badges/{userId}")
    public ResponseEntity<List<BadgeResponse>> getUserBadges(@PathVariable UUID userId) {
        return ResponseEntity.ok(gamificationService.getUserBadges(userId));
    }

    @PostMapping("/badges/{userId}/{badgeType}")
    public ResponseEntity<BadgeResponse> awardBadge(
            @PathVariable UUID userId,
            @PathVariable String badgeType
    ) {
        return ResponseEntity.ok(gamificationService.awardBadge(userId, gamification.enums.BadgeType.valueOf(badgeType)));
    }

    @PostMapping("/xp/{userId}")
    public ResponseEntity<Void> addXp(
            @PathVariable UUID userId,
            @RequestParam int xp
    ) {
        gamificationService.addXp(userId, xp);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/streak/{userId}")
    public ResponseEntity<Void> updateStreak(
            @PathVariable UUID userId,
            @RequestParam int streak
    ) {
        gamificationService.updateStreak(userId, streak);
        return ResponseEntity.ok().build();
    }
}
