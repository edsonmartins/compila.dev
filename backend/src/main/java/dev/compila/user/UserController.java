package dev.compila.user;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.submission.SubmissionRepository;
import dev.compila.submission.enums.SubmissionStatus;
import dev.compila.user.dto.ChangePasswordRequest;
import dev.compila.user.dto.UpdateProfileRequest;
import dev.compila.user.dto.UserProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            SubmissionRepository submissionRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileResponse> getProfileByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(this::buildProfileResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserProfileResponse> getProfileById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(this::buildProfileResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody UpdateProfileRequest request
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.fullName());
        user.setBio(request.bio());
        user.setAvatarUrl(request.avatarUrl());
        user.setLocation(request.location());
        user.setWebsiteUrl(request.websiteUrl());
        user.setGithubUrl(request.githubUrl());
        user.setLinkedinUrl(request.linkedinUrl());

        user = userRepository.save(user);
        return ResponseEntity.ok(buildProfileResponse(user));
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody ChangePasswordRequest request
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is invalid");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    private UserProfileResponse buildProfileResponse(User user) {
        long attemptedChallenges = submissionRepository.countDistinctChallengesAttemptedByUserId(user.getId());
        long completedChallenges = submissionRepository.countDistinctChallengesByUserIdAndStatus(
                user.getId(),
                SubmissionStatus.PASSED
        );
        return UserProfileResponse.from(user, completedChallenges, attemptedChallenges);
    }
}
