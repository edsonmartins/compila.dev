package dev.compila.social.enums;

/**
 * Types of social posts in the developer community feed
 */
public enum PostType {
    /**
     * Question seeking help from the community
     */
    QUESTION,

    /**
     * Sharing knowledge, article, or learning resource
     */
    SHARE,

    /**
     * Showcasing a completed project
     */
    PROJECT,

    /**
     * Automatic post when completing a challenge
     */
    CHALLENGE_COMPLETED,

    /**
     * Automatic post when earning an achievement/badge
     */
    ACHIEVEMENT,

    /**
     * Code snippet with explanation or question
     */
    SNIPPET,

    /**
     * Requesting pair programming session
     */
    PAIR_REQUEST,

    /**
     * Requesting code review from community
     */
    CODE_REVIEW
}
