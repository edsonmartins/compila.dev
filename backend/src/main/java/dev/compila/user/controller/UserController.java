package dev.compila.user.controller;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller for user settings
 */
@RestController
@RequestMapping("/users/settings")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Update auto-share milestones setting
     */
    @PutMapping("/auto-share")
    public ResponseEntity<AutoShareResponse> updateAutoShareMilestones(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AutoShareRequest request
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setAutoShareMilestones(request.autoShare());
        userRepository.save(user);

        return ResponseEntity.ok(new AutoShareResponse(user.getAutoShareMilestones()));
    }

    /**
     * Get current auto-share setting
     */
    @GetMapping("/auto-share")
    public ResponseEntity<AutoShareResponse> getAutoShareMilestones(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(new AutoShareResponse(user.getAutoShareMilestones()));
    }

    // Request/Response DTOs
    public record AutoShareRequest(
            Boolean autoShare
    ) {}

    public record AutoShareResponse(
            Boolean autoShare
    ) {}
}
