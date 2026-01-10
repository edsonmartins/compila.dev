package dev.compila.submission;

import dev.compila.submission.dto.SubmitRequest;
import dev.compila.submission.dto.SubmissionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<SubmissionResponse>> findByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(submissionService.findByUserId(userId, pageable));
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<Page<SubmissionResponse>> findByChallengeId(
            @PathVariable UUID challengeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(submissionService.findByChallengeId(challengeId, pageable));
    }

    @GetMapping("/user/{userId}/challenge/{challengeId}")
    public ResponseEntity<?> findLatestByUserAndChallenge(
            @PathVariable UUID userId,
            @PathVariable UUID challengeId
    ) {
        return ResponseEntity.ok(submissionService.findLatestByUserAndChallenge(userId, challengeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(submissionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SubmissionResponse> submit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitRequest request
    ) {
        // Extract user ID from email (you may want to store userId in JWT claims instead)
        UUID userId = UUID.randomUUID(); // TODO: Get from JWT
        return ResponseEntity.ok(submissionService.submit(userId, request));
    }
}
