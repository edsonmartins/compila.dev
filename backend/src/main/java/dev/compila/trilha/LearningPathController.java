package dev.compila.trilha;

import dev.compila.trilha.dto.LearningPathResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learning-paths")
@CrossOrigin(origins = "*")
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }

    @GetMapping
    public ResponseEntity<List<LearningPathResponse>> findAll() {
        return ResponseEntity.ok(learningPathService.findAll());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<LearningPathResponse>> findFeatured() {
        return ResponseEntity.ok(learningPathService.findFeatured());
    }

    @GetMapping("/stack/{stack}")
    public ResponseEntity<List<LearningPathResponse>> findByStack(@PathVariable String stack) {
        return ResponseEntity.ok(learningPathService.findByStack(stack));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<LearningPathResponse> findBySlug(@PathVariable String slug) {
        LearningPathResponse path = learningPathService.findBySlug(slug);
        if (path == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(path);
    }
}
