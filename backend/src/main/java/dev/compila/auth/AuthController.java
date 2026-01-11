package dev.compila.auth;

import dev.compila.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        Token token = authService.register(request);
        return ResponseEntity.ok(new AuthResponse(token.accessToken(), token.refreshToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Token token = authService.login(request.email(), request.password());
        return ResponseEntity.ok(new AuthResponse(token.accessToken(), token.refreshToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        Token token = authService.refreshToken(request.refreshToken());
        if (token != null) {
            return ResponseEntity.ok(new AuthResponse(token.accessToken(), token.refreshToken()));
        }
        throw new RuntimeException("Invalid refresh token");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(UserResponse.from(user));
    }

    public record AuthResponse(String accessToken, String refreshToken) {}
    public record RefreshTokenRequest(String refreshToken) {}
    public record UserResponse(
            UUID id,
            String username,
            String email,
            String fullName,
            String bio,
            String avatarUrl,
            Integer level,
            Long xp,
            Integer streakCurrent,
            Integer streakBest,
            String subscriptionPlan
    ) {
        public static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getBio(),
                    user.getAvatarUrl(),
                    user.getLevel(),
                    user.getXp(),
                    user.getStreakCurrent(),
                    user.getStreakBest(),
                    user.getSubscriptionPlan().name()
            );
        }
    }
}
