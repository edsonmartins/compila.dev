package dev.compila.social.entity;

import dev.compila.common.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Comment entity for social feed posts
 * Supports nested comments and code snippets
 */
@Entity
@Table(name = "comments")
public class Comment extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    /**
     * Parent comment ID for nested replies
     * Null for top-level comments
     */
    @Column(name = "parent_id")
    private UUID parentId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Code snippet included in the comment
     * Stored as JSONB: {language, code, lineHighlights}
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> codeSnippet;

    /**
     * Whether this comment is marked as the solution to the parent post
     * Only applicable for posts of type QUESTION
     */
    @Column(name = "is_solution", nullable = false)
    private Boolean isSolution = false;

    /**
     * Kudos received on this comment (for helpful answers)
     */
    @Column(name = "fire_count", nullable = false)
    private Integer fireCount = 0;

    /**
     * When this comment was marked as a solution
     */
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    /**
     * Whether the comment is deleted (soft delete)
     */
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    /**
     * Display text when comment is deleted
     */
    @Column(name = "deleted_text")
    private String deletedText = "Este comentário foi removido.";

    // Constructors
    public Comment() {
    }

    public Comment(UUID userId, UUID postId, String content) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getPostId() {
        return postId;
    }

    public void setPostId(UUID postId) {
        this.postId = postId;
    }

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Map<String, Object> getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(Map<String, Object> codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public Boolean getIsSolution() {
        return isSolution;
    }

    public void setIsSolution(Boolean isSolution) {
        this.isSolution = isSolution;
        if (isSolution && acceptedAt == null) {
            acceptedAt = LocalDateTime.now();
        }
    }

    public Integer getFireCount() {
        return fireCount;
    }

    public void setFireCount(Integer fireCount) {
        this.fireCount = fireCount;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(LocalDateTime acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getDeletedText() {
        return deletedText;
    }

    public void setDeletedText(String deletedText) {
        this.deletedText = deletedText;
    }

    /**
     * Increment fire count (kudos for helpful comments)
     */
    public void incrementFireCount() {
        this.fireCount++;
    }

    /**
     * Get display content (returns deleted text if comment is deleted)
     */
    public String getDisplayContent() {
        return isDeleted ? deletedText : content;
    }
}
