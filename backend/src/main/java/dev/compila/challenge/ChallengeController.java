package dev.compila.challenge;

import dev.compila.challenge.dto.ChallengeRequest;
import dev.compila.challenge.dto.ChallengeResponse;
import dev.compila.challenge.dto.ChallengeSummaryResponse;
import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public ResponseEntity<Page<ChallengeSummaryResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(challengeService.findAllPublished(pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ChallengeSummaryResponse>> findFeatured() {
        return ResponseEntity.ok(challengeService.findAllPublished().stream()
                .filter(ChallengeSummaryResponse::featured)
                .limit(6)
                .toList());
    }

    @GetMapping("/stack/{stack}")
    public ResponseEntity<Page<ChallengeSummaryResponse>> findByStack(
            @PathVariable ChallengeStack stack,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(challengeService.findByStack(stack, pageable));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<Page<ChallengeSummaryResponse>> findByLevel(
            @PathVariable ChallengeLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(challengeService.findByLevel(level, pageable));
    }

    @GetMapping("/technology/{technology}")
    public ResponseEntity<Page<ChallengeSummaryResponse>> findByTechnology(
            @PathVariable String technology,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(challengeService.findByTechnology(technology, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChallengeSummaryResponse>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(challengeService.search(q, pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ChallengeResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(challengeService.findBySlug(slug));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ChallengeResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(challengeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChallengeResponse> create(@Valid @RequestBody ChallengeRequest request) {
        return ResponseEntity.ok(challengeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChallengeResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ChallengeRequest request
    ) {
        return ResponseEntity.ok(challengeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        challengeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
