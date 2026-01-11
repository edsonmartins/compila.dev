package dev.compila.social.controller;

import dev.compila.auth.security.userdetails.UserDetailsImpl;
import dev.compila.social.dto.*;
import dev.compila.social.enums.KudoType;
import dev.compila.social.enums.PostType;
import dev.compila.social.service.SocialService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for social feed operations
 */
@RestController
@RequestMapping("/feed")
@CrossOrigin(origins = "*")
public class SocialController {

    private final SocialService socialService;

    public SocialController(SocialService socialService) {
        this.socialService = socialService;
    }

    // ==================== Feed Endpoints ====================

    /**
     * Get main feed - combines followed users' posts and trending content
     */
    @GetMapping
    public ResponseEntity<Page<FeedPostResponse>> getFeed(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        UUID userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(socialService.getFeed(userId, page, size));
    }

    /**
     * Get trending posts
     */
    @GetMapping("/trending")
    public ResponseEntity<Page<FeedPostResponse>> getTrending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getTrending(page, size));
    }

    /**
     * Get posts by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<FeedPostResponse>> getPostsByType(
            @PathVariable PostType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getPostsByType(type, page, size));
    }

    /**
     * Get unsolved questions
     */
    @GetMapping("/questions/unsolved")
    public ResponseEntity<Page<FeedPostResponse>> getUnsolvedQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getUnsolvedQuestions(page, size));
    }

    /**
     * Get posts with code snippets
     */
    @GetMapping("/snippets")
    public ResponseEntity<Page<FeedPostResponse>> getPostsWithSnippets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getPostsWithSnippets(page, size));
    }

    /**
     * Search posts
     */
    @GetMapping("/search")
    public ResponseEntity<Page<FeedPostResponse>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.searchPosts(query, page, size));
    }

    /**
     * Get a single post by ID
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<FeedPostResponse> getPostById(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        UUID userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(socialService.getPostById(postId, userId));
    }

    /**
     * Get posts by user
     */
    @GetMapping("/users/{userId}/posts")
    public ResponseEntity<Page<FeedPostResponse>> getPostsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getPostsByUser(userId, page, size));
    }

    /**
     * Create a new post
     */
    @PostMapping("/posts")
    public ResponseEntity<FeedPostResponse> createPost(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreatePostRequest request
    ) {
        return ResponseEntity.ok(socialService.createPost(userDetails.getId(), request));
    }

    /**
     * Update a post
     */
    @PutMapping("/posts/{postId}")
    public ResponseEntity<FeedPostResponse> updatePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        return ResponseEntity.ok(socialService.updatePost(postId, userDetails.getId(), request));
    }

    /**
     * Delete a post (soft delete)
     */
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        socialService.deletePost(postId, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    // ==================== Kudo Endpoints ====================

    /**
     * Toggle kudo on a post
     */
    @PostMapping("/posts/{postId}/kudos")
    public ResponseEntity<KudoResponse> toggleKudo(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam KudoType kudoType
    ) {
        return ResponseEntity.ok(socialService.toggleKudo(postId, userDetails.getId(), kudoType));
    }

    // ==================== Comment Endpoints ====================

    /**
     * Get comments for a post
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getComments(postId, page, size));
    }

    /**
     * Add a comment to a post
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity.ok(socialService.addComment(postId, userDetails.getId(), request));
    }

    /**
     * Get replies to a comment
     */
    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<Page<CommentResponse>> getCommentReplies(
            @PathVariable UUID commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(socialService.getCommentReplies(commentId, page, size));
    }

    /**
     * Mark a comment as the solution to a question post
     */
    @PutMapping("/posts/{postId}/comments/{commentId}/solution")
    public ResponseEntity<CommentResponse> markAsSolution(
            @PathVariable UUID postId,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(socialService.markAsSolution(postId, commentId, userDetails.getId()));
    }

    // ==================== Follow Endpoints ====================

    /**
     * Toggle follow a user
     */
    @PostMapping("/users/{targetUserId}/follow")
    public ResponseEntity<FollowResponse> toggleFollow(
            @PathVariable UUID targetUserId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(socialService.toggleFollow(targetUserId, userDetails.getId()));
    }

    /**
     * Get followers of a user
     */
    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<List<SocialUserStatsResponse>> getFollowers(@PathVariable UUID userId) {
        return ResponseEntity.ok(socialService.getFollowers(userId));
    }

    /**
     * Get users followed by a user
     */
    @GetMapping("/users/{userId}/following")
    public ResponseEntity<List<SocialUserStatsResponse>> getFollowing(@PathVariable UUID userId) {
        return ResponseEntity.ok(socialService.getFollowing(userId));
    }

    /**
     * Get user social stats
     */
    @GetMapping("/users/{userId}/stats")
    public ResponseEntity<SocialUserStatsResponse> getUserSocialStats(@PathVariable UUID userId) {
        return ResponseEntity.ok(socialService.getUserSocialStats(userId));
    }
}
