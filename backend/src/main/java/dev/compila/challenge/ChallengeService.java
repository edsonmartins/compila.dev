package dev.compila.challenge;

import dev.compila.challenge.dto.ChallengeRequest;
import dev.compila.challenge.dto.ChallengeResponse;
import dev.compila.challenge.dto.ChallengeSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

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
                .orElseThrow(() -> new RuntimeException("Challenge not found: " + slug));
        return ChallengeResponse.from(challenge);
    }

    public ChallengeResponse findById(UUID id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found: " + id));
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
                .orElseThrow(() -> new RuntimeException("Challenge not found: " + id));
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
        challengeRepository.findById(challengeId).ifPresent(challenge -> {
            challenge.setCompletedCount(challenge.getCompletedCount() + 1);
            challengeRepository.save(challenge);
        });
    }

    @Transactional
    public void incrementAttemptedCount(UUID challengeId) {
        challengeRepository.findById(challengeId).ifPresent(challenge -> {
            challenge.setAttemptedCount(challenge.getAttemptedCount() + 1);
            challengeRepository.save(challenge);
        });
    }

    private void updateChallengeFromRequest(Challenge challenge, ChallengeRequest request) {
        challenge.setSlug(request.slug());
        challenge.setTitle(request.title());
        challenge.setShortDescription(request.shortDescription());
        challenge.setDescription(request.description());
        challenge.setStack(request.stack());
        challenge.setLevel(request.level());
        challenge.setDifficulty(request.difficulty());
        challenge.setTechnologies(request.technologies());
        challenge.setTags(request.tags());
        challenge.setRequirements(request.requirements());
        challenge.setStarterCode(request.starterCode());
        challenge.setSolutionCode(request.solutionCode());
        challenge.setXpReward(request.xpReward());
        challenge.setEstimatedTimeMinutes(request.estimatedTimeMinutes());
        challenge.setBadges(request.badges());
        challenge.setPublished(request.published());
        challenge.setFeatured(request.featured());
    }
}
