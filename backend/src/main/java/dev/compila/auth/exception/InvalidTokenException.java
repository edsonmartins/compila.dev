package dev.compila.auth.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a token (JWT, refresh token, etc.) is invalid,
 * expired, or malformed.
 */
public class InvalidTokenException extends AuthException {

    public InvalidTokenException() {
        super("Invalid or expired token", HttpStatus.UNAUTHORIZED, "INVALID_TOKEN");
    }

    public InvalidTokenException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "INVALID_TOKEN");
    }

    public InvalidTokenException(String message, String errorCode) {
        super(message, HttpStatus.UNAUTHORIZED, errorCode);
    }
}
