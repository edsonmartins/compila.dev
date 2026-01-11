package dev.compila.user.controller;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.user.entity.UserSkill;
import dev.compila.user.enums.ProficiencyLevel;
import dev.compila.user.enums.TechnologyType;
import dev.compila.user.service.UserSkillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for user skills and technology stack
 */
@RestController
@RequestMapping("/users/skills")
@CrossOrigin(origins = "*")
public class UserSkillController {

    private final UserSkillService userSkillService;

    public UserSkillController(UserSkillService userSkillService) {
        this.userSkillService = userSkillService;
    }

    /**
     * Get all skills for current user
     */
    @GetMapping
    public ResponseEntity<List<UserSkill>> getCurrentUserSkills(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.getUserSkills(userDetails.getId()));
    }

    /**
     * Get all skills for a specific user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSkill>> getUserSkills(@PathVariable UUID userId) {
        return ResponseEntity.ok(userSkillService.getUserSkills(userId));
    }

    /**
     * Get verified skills (from challenges)
     */
    @GetMapping("/verified")
    public ResponseEntity<List<UserSkill>> getVerifiedSkills(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.getVerifiedSkills(userDetails.getId()));
    }

    /**
     * Get manual skills
     */
    @GetMapping("/manual")
    public ResponseEntity<List<UserSkill>> getManualSkills(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.getManualSkills(userDetails.getId()));
    }

    /**
     * Get skills by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<UserSkill>> getSkillsByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.getSkillsByCategory(userDetails.getId(), category));
    }

    /**
     * Get skill statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<UserSkillService.SkillStats> getSkillStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.getSkillStats(userDetails.getId()));
    }

    /**
     * Add a manual skill
     */
    @PostMapping
    public ResponseEntity<UserSkill> addSkill(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AddSkillRequest request
    ) {
        UserSkill skill = userSkillService.addManualSkill(
                userDetails.getId(),
                request.technology(),
                request.proficiencyLevel()
        );
        return ResponseEntity.ok(skill);
    }

    /**
     * Update skill level (manual skills only)
     */
    @PutMapping("/{technology}")
    public ResponseEntity<UserSkill> updateSkillLevel(
            @PathVariable TechnologyType technology,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdateSkillRequest request
    ) {
        UserSkill skill = userSkillService.updateSkillLevel(
                userDetails.getId(),
                technology,
                request.proficiencyLevel()
        );
        return ResponseEntity.ok(skill);
    }

    /**
     * Remove a manual skill
     */
    @DeleteMapping("/{technology}")
    public ResponseEntity<Void> removeSkill(
            @PathVariable TechnologyType technology,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        userSkillService.removeSkill(userDetails.getId(), technology);
        return ResponseEntity.ok().build();
    }

    /**
     * Check if user has a specific technology
     */
    @GetMapping("/has/{technology}")
    public ResponseEntity<Boolean> hasSkill(
            @PathVariable TechnologyType technology,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(userSkillService.hasSkill(userDetails.getId(), technology));
    }

    // Request DTOs
    public record AddSkillRequest(
            TechnologyType technology,
            ProficiencyLevel proficiencyLevel
    ) {}

    public record UpdateSkillRequest(
            ProficiencyLevel proficiencyLevel
    ) {}
}
