package dev.compila.auth;

/**
 * Token response wrapper
 */
public record Token(String accessToken, String refreshToken) {}
