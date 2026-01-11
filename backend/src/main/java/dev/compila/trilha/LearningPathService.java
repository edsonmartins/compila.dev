package dev.compila.trilha;

import dev.compila.trilha.dto.LearningPathResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LearningPathService {

    private final LearningPathRepository learningPathRepository;

    public LearningPathService(LearningPathRepository learningPathRepository) {
        this.learningPathRepository = learningPathRepository;
    }

    public List<LearningPathResponse> findAll() {
        return learningPathRepository.findAllByPopularity().stream()
                .map(LearningPathResponse::from)
                .toList();
    }

    public List<LearningPathResponse> findByStack(String stack) {
        return learningPathRepository.findByStack(LearningPath.ChallengeStack.valueOf(stack))
                .stream()
                .map(LearningPathResponse::from)
                .toList();
    }

    public LearningPathResponse findBySlug(String slug) {
        return learningPathRepository.findBySlug(slug)
                .map(LearningPathResponse::from)
                .orElse(null);
    }

    public List<LearningPathResponse> findFeatured() {
        return learningPathRepository.findFeatured().stream()
                .map(LearningPathResponse::from)
                .toList();
    }
}
