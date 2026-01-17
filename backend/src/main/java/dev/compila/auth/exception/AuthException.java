package dev.compila.auth.exception;

import org.springframework.http.HttpStatus;

import java.util.UUID;

/**
 * Base exception for authentication and authorization errors.
 * Provides consistent error responses with appropriate HTTP status codes.
 */
public class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public AuthException(String message, HttpStatus status) {
        this(message, status, null);
    }

    public AuthException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
