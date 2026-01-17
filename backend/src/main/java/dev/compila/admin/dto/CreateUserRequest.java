package dev.compila.admin.dto;

public record CreateUserRequest(
    String username,
    String email,
    String password,
    String fullName,
    String role,
    String subscription,
    Integer level,
    Long xp
) {}
