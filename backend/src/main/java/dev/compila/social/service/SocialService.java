package dev.compila.social.service;

import dev.compila.gamification.GamificationService;
import dev.compila.social.dto.*;
import dev.compila.social.entity.Comment;
import dev.compila.social.entity.Follow;
import dev.compila.social.entity.Kudo;
import dev.compila.social.entity.Post;
import dev.compila.social.enums.KudoType;
import dev.compila.social.enums.PostType;
import dev.compila.social.repository.CommentRepository;
import dev.compila.social.repository.FollowRepository;
import dev.compila.social.repository.KudoRepository;
import dev.compila.social.repository.PostRepository;
import dev.compila.user.User;
import dev.compila.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for social feed operations
 */
@Service
public class SocialService {

    private final PostRepository postRepository;
    private final KudoRepository kudoRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    public SocialService(
            PostRepository postRepository,
            KudoRepository kudoRepository,
            CommentRepository commentRepository,
            FollowRepository followRepository,
            UserRepository userRepository,
            GamificationService gamificationService
    ) {
        this.postRepository = postRepository;
        this.kudoRepository = kudoRepository;
        this.commentRepository = commentRepository;
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.gamificationService = gamificationService;
    }

    // ==================== Post Operations ====================

    /**
     * Get main feed - combines followed users' posts and trending content
     */
    public Page<FeedPostResponse> getFeed(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Get followed users
        List<UUID> followedIds = followRepository.findFollowingIds(userId);

        Page<Post> posts;
        if (followedIds.isEmpty()) {
            // If not following anyone, show trending posts
            posts = postRepository.findTrending(pageable);
        } else {
            // Mix of followed users and some trending content
            posts = postRepository.findFeedFromFollowedUsers(followedIds, pageable);
        }

        return posts.map(post -> toFeedPostResponse(post, userId));
    }

    /**
     * Get trending posts
     */
    public Page<FeedPostResponse> getTrending(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findTrending(pageable);
        return posts.map(post -> toFeedPostResponse(post, null));
    }

    /**
     * Get posts by type (e.g., questions, snippets)
     */
    public Page<FeedPostResponse> getPostsByType(PostType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByTypeAndPublishedTrueOrderByCreatedAtDesc(type, pageable);
        return posts.map(post -> toFeedPostResponse(post, null));
    }

    /**
     * Get unsolved questions
     */
    public Page<FeedPostResponse> getUnsolvedQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByTypeAndIsSolvedFalseAndPublishedTrueOrderByCreatedAtDesc(
                PostType.QUESTION, pageable);
        return posts.map(post -> toFeedPostResponse(post, null));
    }

    /**
     * Get posts with code snippets
     */
    public Page<FeedPostResponse> getPostsWithSnippets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findPostsWithSnippets(pageable);
        return posts.map(post -> toFeedPostResponse(post, null));
    }

    /**
     * Search posts
     */
    public Page<FeedPostResponse> searchPosts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.searchPosts(query, pageable);
        return posts.map(post -> toFeedPostResponse(post, null));
    }

    /**
     * Get a single post by ID
     */
    public FeedPostResponse getPostById(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        // Increment view count
        postRepository.incrementViewCount(postId);

        return toFeedPostResponse(post, userId);
    }

    /**
     * Get posts by user
     */
    public Page<FeedPostResponse> getPostsByUser(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByUserIdAndPublishedTrueOrderByCreatedAtDesc(userId, pageable);
        return posts.map(post -> toFeedPostResponse(post, userId));
    }

    /**
     * Get recent posts by user (returns list for internal use)
     */
    public List<FeedPostResponse> getRecentPostsByUser(UUID userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findByUserIdAndPublishedTrueOrderByCreatedAtDesc(userId, pageable);
        return posts.stream()
                .map(post -> toFeedPostResponse(post, userId))
                .collect(Collectors.toList());
    }

    /**
     * Create a new post
     */
    @Transactional
    public FeedPostResponse createPost(UUID userId, CreatePostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Post post = new Post(userId, request.content(), request.type());
        post.setCodeSnippet(request.codeSnippet());
        post.setMetadata(request.metadata());
        post.setImageUrl(request.imageUrl());

        if (request.challengeId() != null) {
            post.setChallengeId(UUID.fromString(request.challengeId()));
        }
        if (request.badgeId() != null) {
            post.setBadgeId(UUID.fromString(request.badgeId()));
        }

        post = postRepository.save(post);

        // Award XP for creating content
        int xpAward = switch (request.type()) {
            case SNIPPET, PROJECT -> 5;
            case QUESTION -> 2;
            case CODE_REVIEW -> 3;
            default -> 1;
        };
        gamificationService.addXp(userId, xpAward);

        return toFeedPostResponse(post, userId);
    }

    /**
     * Update a post
     */
    @Transactional
    public FeedPostResponse updatePost(UUID postId, UUID userId, UpdatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only edit your own posts");
        }

        post.setContent(request.content());
        post.setCodeSnippet(request.codeSnippet());
        post.setMetadata(request.metadata());

        post = postRepository.save(post);

        return toFeedPostResponse(post, userId);
    }

    /**
     * Delete a post (soft delete)
     */
    @Transactional
    public void deletePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own posts");
        }

        post.setPublished(false);
        postRepository.save(post);
    }

    // ==================== Kudo Operations ====================

    /**
     * Toggle kudo on a post
     */
    @Transactional
    public KudoResponse toggleKudo(UUID postId, UUID userId, KudoType kudoType) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Optional<Kudo> existingKudo = kudoRepository.findByUserIdAndPostId(userId, postId);

        if (existingKudo.isPresent()) {
            Kudo kudo = existingKudo.get();

            if (kudo.getKudoType() == kudoType) {
                // Remove kudo if same type
                kudo.setIsActive(false);
                kudoRepository.save(kudo);

                // Decrement post counter
                postRepository.decrementKudoCount(postId, kudoType.name());

                // Remove XP from post author
                gamificationService.addXp(post.getUserId(), -kudoType.getXpValue());

                return new KudoResponse(
                        false,
                        postId.toString(),
                        null,
                        "Kudo removido",
                        post.getFireCount(),
                        post.getRocketCount(),
                        post.getLightbulbCount(),
                        post.getCleanCount(),
                        post.getTargetCount(),
                        post.getPairCount(),
                        post.getTotalKudos()
                );
            } else {
                // Change kudo type - first decrement old type
                KudoType oldType = kudo.getKudoType();
                postRepository.decrementKudoCount(postId, oldType.name());

                // Update and increment new type
                kudo.setKudoType(kudoType);
                kudo.setIsActive(true);
                kudoRepository.save(kudo);

                postRepository.incrementKudoCount(postId, kudoType.name());

                // Adjust XP for post author
                gamificationService.addXp(post.getUserId(), kudoType.getXpValue() - oldType.getXpValue());

                return new KudoResponse(
                        true,
                        postId.toString(),
                        kudoType,
                        "Kudo alterado para " + kudoType.getEmoji(),
                        post.getFireCount(),
                        post.getRocketCount(),
                        post.getLightbulbCount(),
                        post.getCleanCount(),
                        post.getTargetCount(),
                        post.getPairCount(),
                        post.getTotalKudos()
                );
            }
        } else {
            // Add new kudo
            Kudo newKudo = new Kudo(userId, postId, kudoType);
            kudoRepository.save(newKudo);

            // Increment post counter
            postRepository.incrementKudoCount(postId, kudoType.name());

            // Award XP to post author
            gamificationService.addXp(post.getUserId(), kudoType.getXpValue());

            return new KudoResponse(
                    true,
                    postId.toString(),
                    kudoType,
                    "Kudo " + kudoType.getEmoji() + " enviado!",
                    post.getFireCount() + 1,
                    post.getRocketCount(),
                    post.getLightbulbCount(),
                    post.getCleanCount(),
                    post.getTargetCount(),
                    post.getPairCount(),
                    post.getTotalKudos() + 1
            );
        }
    }

    // ==================== Comment Operations ====================

    /**
     * Get comments for a post
     */
    public Page<CommentResponse> getComments(UUID postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> comments = commentRepository.findByPostIdAndParentIdIsNullOrderByCreatedAtAsc(postId, pageable);

        return comments.map(comment -> toCommentResponse(comment, null));
    }

    /**
     * Add a comment to a post
     */
    @Transactional
    public CommentResponse addComment(UUID postId, UUID userId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Comment comment = new Comment(userId, postId, request.content());
        comment.setCodeSnippet(request.codeSnippet());

        if (request.parentId() != null) {
            comment.setParentId(UUID.fromString(request.parentId()));
        }

        comment = commentRepository.save(comment);

        // Increment post comment count
        postRepository.incrementCommentCount(postId);

        // Award XP for commenting
        gamificationService.addXp(userId, 1);

        return toCommentResponse(comment, userId);
    }

    /**
     * Mark a comment as the solution to a question post
     */
    @Transactional
    public CommentResponse markAsSolution(UUID postId, UUID commentId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Only post author can mark solution");
        }

        if (post.getType() != PostType.QUESTION) {
            throw new IllegalArgumentException("Only QUESTION posts can have solutions");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getPostId().equals(postId)) {
            throw new IllegalArgumentException("Comment does not belong to this post");
        }

        // Mark post as solved
        postRepository.markAsSolved(postId, commentId);

        // Mark comment as solution
        comment.setIsSolution(true);
        comment = commentRepository.save(comment);

        // Award XP to solution provider
        int solutionXp = 10;
        gamificationService.addXp(comment.getUserId(), solutionXp);

        return toCommentResponse(comment, userId);
    }

    /**
     * Get replies to a comment
     */
    public Page<CommentResponse> getCommentReplies(UUID commentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtAsc(commentId, pageable);

        return replies.map(comment -> toCommentResponse(comment, null));
    }

    // ==================== Follow Operations ====================

    /**
     * Toggle follow a user
     */
    @Transactional
    public FollowResponse toggleFollow(UUID targetUserId, UUID followerId) {
        if (followerId.equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        boolean existing = followRepository.existsByFollowerIdAndFollowingId(followerId, targetUserId);

        if (existing) {
            // Unfollow
            followRepository.deleteByFollowerIdAndFollowingId(followerId, targetUserId);

            int followersCount = (int) followRepository.countFollowers(targetUserId);
            int followingCount = (int) followRepository.countFollowing(followerId);

            return new FollowResponse(false, followersCount, followingCount);
        } else {
            // Follow
            Follow follow = new Follow(followerId, targetUserId);
            followRepository.save(follow);

            // Award XP for gaining a follower
            gamificationService.addXp(targetUserId, 3);

            int followersCount = (int) followRepository.countFollowers(targetUserId);
            int followingCount = (int) followRepository.countFollowing(followerId);

            return new FollowResponse(true, followersCount, followingCount);
        }
    }

    /**
     * Get followers of a user
     */
    public List<SocialUserStatsResponse> getFollowers(UUID userId) {
        List<Follow> follows = followRepository.findByFollowingId(userId);

        return follows.stream()
                .map(f -> getUserStats(f.getFollowerId()))
                .toList();
    }

    /**
     * Get users followed by a user
     */
    public List<SocialUserStatsResponse> getFollowing(UUID userId) {
        List<Follow> follows = followRepository.findByFollowerId(userId);

        return follows.stream()
                .map(f -> getUserStats(f.getFollowingId()))
                .toList();
    }

    /**
     * Get user stats for social context
     */
    public SocialUserStatsResponse getUserSocialStats(UUID userId) {
        return getUserStats(userId);
    }

    // ==================== Helper Methods ====================

    private FeedPostResponse toFeedPostResponse(Post post, UUID currentUserId) {
        // Get user's kudo on this post
        KudoType userKudo = null;
        if (currentUserId != null) {
            userKudo = kudoRepository.findByUserIdAndPostId(currentUserId, post.getId())
                    .filter(Kudo::getIsActive)
                    .map(Kudo::getKudoType)
                    .orElse(null);
        }

        // Get user info
        User author = userRepository.findById(post.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return new FeedPostResponse(
                post.getId().toString(),
                post.getUserId().toString(),
                author.getUsername(),
                author.getFullName(),
                author.getAvatarUrl(),
                post.getContent(),
                post.getType(),
                post.getCodeSnippet(),
                post.getMetadata(),
                post.getFireCount(),
                post.getRocketCount(),
                post.getLightbulbCount(),
                post.getCleanCount(),
                post.getTargetCount(),
                post.getPairCount(),
                post.getTotalKudos(),
                userKudo,
                post.getCommentCount(),
                post.getViewCount(),
                post.getSolutionCommentId() != null ? post.getSolutionCommentId().toString() : null,
                post.getIsSolved(),
                post.getCreatedAt(),
                post.getPublishedAt(),
                formatTimeAgo(post.getCreatedAt()),
                post.getImageUrl(),
                post.getChallengeId() != null ? post.getChallengeId().toString() : null,
                post.getBadgeId() != null ? post.getBadgeId().toString() : null
        );
    }

    private CommentResponse toCommentResponse(Comment comment, UUID currentUserId) {
        User author = userRepository.findById(comment.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        int replyCount = (int) commentRepository.countReplies(comment.getId());

        return new CommentResponse(
                comment.getId().toString(),
                comment.getUserId().toString(),
                author.getUsername(),
                author.getFullName(),
                author.getAvatarUrl(),
                comment.getPostId().toString(),
                comment.getParentId() != null ? comment.getParentId().toString() : null,
                comment.getContent(),
                comment.getCodeSnippet(),
                comment.getIsSolution(),
                comment.getFireCount(),
                comment.getAcceptedAt(),
                comment.getCreatedAt(),
                formatTimeAgo(comment.getCreatedAt()),
                replyCount,
                currentUserId != null && currentUserId.equals(comment.getUserId()),
                comment.getIsDeleted()
        );
    }

    private SocialUserStatsResponse getUserStats(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        int postsCount = (int) postRepository.countByUserIdAndPublishedTrue(userId);
        int followersCount = (int) followRepository.countFollowers(userId);
        int followingCount = (int) followRepository.countFollowing(userId);
        int totalKudosReceived = (int) kudoRepository.countKudosReceivedByUserId(userId);
        int solutionsProvided = (int) commentRepository.countSolutionsByUserId(userId);

        // TODO: Extract top technologies from completed challenges
        List<String> topTechnologies = List.of("React", "TypeScript", "Java");

        // TODO: Get user badges
        List<String> badges = List.of();

        return new SocialUserStatsResponse(
                userId.toString(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getBio(),
                postsCount,
                followersCount,
                followingCount,
                totalKudosReceived,
                solutionsProvided,
                topTechnologies,
                badges
        );
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "agora";
        }

        long seconds = ChronoUnit.SECONDS.between(dateTime, LocalDateTime.now());
        long minutes = ChronoUnit.MINUTES.between(dateTime, LocalDateTime.now());
        long hours = ChronoUnit.HOURS.between(dateTime, LocalDateTime.now());
        long days = ChronoUnit.DAYS.between(dateTime, LocalDateTime.now());

        if (seconds < 60) {
            return "agora pouco";
        } else if (minutes < 60) {
            return minutes + " min atrás";
        } else if (hours < 24) {
            return hours + "h atrás";
        } else if (days == 1) {
            return "ontem";
        } else if (days < 30) {
            return days + " dias atrás";
        } else {
            long months = ChronoUnit.MONTHS.between(dateTime, LocalDateTime.now());
            if (months < 12) {
                return months + " meses atrás";
            } else {
                long years = ChronoUnit.YEARS.between(dateTime, LocalDateTime.now());
                return years + " anos atrás";
            }
        }
    }
}
