package dev.compila.challenge;

import dev.compila.auth.exception.ResourceNotFoundException;
import dev.compila.challenge.dto.ChallengeRequest;
import dev.compila.challenge.dto.ChallengeResponse;
import dev.compila.challenge.dto.ChallengeSummaryResponse;
import dev.compila.challenge.enums.ChallengeLevel;
import dev.compila.challenge.enums.ChallengeStack;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ObjectMapper objectMapper;

    public ChallengeService(ChallengeRepository challengeRepository, ObjectMapper objectMapper) {
        this.challengeRepository = challengeRepository;
        this.objectMapper = objectMapper;
    }

    public List<ChallengeSummaryResponse> findAllPublished() {
        return challengeRepository.findAllPublished().stream()
                .map(ChallengeSummaryResponse::from)
                .toList();
    }

    public Page<ChallengeSummaryResponse> findAllPublished(Pageable pageable) {
        return challengeRepository.findAllByPublishedTrue(pageable)
                .map(ChallengeSummaryResponse::from);
    }

    public Page<ChallengeSummaryResponse> findByStack(ChallengeStack stack, Pageable pageable) {
        return challengeRepository.findByStackAndPublishedTrue(stack, pageable)
                .map(ChallengeSummaryResponse::from);
    }

    public Page<ChallengeSummaryResponse> findByLevel(ChallengeLevel level, Pageable pageable) {
        return challengeRepository.findByLevelAndPublishedTrue(level, pageable)
                .map(ChallengeSummaryResponse::from);
    }

    public Page<ChallengeSummaryResponse> findByTechnology(String technology, Pageable pageable) {
        return challengeRepository.findByTechnologiesContainingAndPublishedTrue(technology, pageable)
                .map(ChallengeSummaryResponse::from);
    }

    public Page<ChallengeSummaryResponse> search(String query, Pageable pageable) {
        return challengeRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(query, pageable)
                .map(ChallengeSummaryResponse::from);
    }

    public ChallengeResponse findBySlug(String slug) {
        Challenge challenge = challengeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug=" + slug));
        return ChallengeResponse.from(challenge);
    }

    public ChallengeResponse findById(UUID id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id=" + id));
        return ChallengeResponse.from(challenge);
    }

    @Transactional
    public ChallengeResponse create(ChallengeRequest request) {
        Challenge challenge = new Challenge();
        updateChallengeFromRequest(challenge, request);
        challenge = challengeRepository.save(challenge);
        return ChallengeResponse.from(challenge);
    }

    @Transactional
    public ChallengeResponse update(UUID id, ChallengeRequest request) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id=" + id));
        updateChallengeFromRequest(challenge, request);
        challenge = challengeRepository.save(challenge);
        return ChallengeResponse.from(challenge);
    }

    @Transactional
    public void delete(UUID id) {
        challengeRepository.deleteById(id);
    }

    @Transactional
    public void incrementCompletedCount(UUID challengeId) {
        // Use atomic increment in database to prevent race conditions
        challengeRepository.incrementCompletedCount(challengeId);
    }

    @Transactional
    public void incrementAttemptedCount(UUID challengeId) {
        // Use atomic increment in database to prevent race conditions
        challengeRepository.incrementAttemptedCount(challengeId);
    }

    private void updateChallengeFromRequest(Challenge challenge, ChallengeRequest request) {
        challenge.setSlug(request.slug());
        challenge.setTitle(request.title());
        challenge.setShortDescription(request.shortDescription());
        challenge.setDescription(request.description());
        challenge.setStack(request.stack());
        challenge.setLevel(request.level());
        challenge.setDifficulty(request.difficulty());
        challenge.setTechnologies(request.technologies() != null ? request.technologies().toArray(new String[0]) : null);
        challenge.setTags(request.tags() != null ? request.tags().toArray(new String[0]) : null);
        challenge.setRequirements(writeJson(request.requirements()));
        challenge.setStarterCode(writeJson(request.starterCode()));
        challenge.setSolutionCode(writeJson(request.solutionCode()));
        challenge.setXpReward(request.xpReward());
        challenge.setEstimatedTimeMinutes(request.estimatedTimeMinutes());
        challenge.setBadges(request.badges() != null ? request.badges().toArray(new String[0]) : null);
        challenge.setPublished(request.published());
        challenge.setFeatured(request.featured());
    }

    private String writeJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize challenge payload", e);
        }
    }
}
