package dev.compila.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Login request DTO
 */
public record LoginRequest(
    @NotBlank
    @Email
    String email,

    @NotBlank
    String password
) {}
