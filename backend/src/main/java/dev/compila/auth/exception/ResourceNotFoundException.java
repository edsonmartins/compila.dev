package dev.compila.auth.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested resource (user, challenge, submission, etc.)
 * cannot be found.
 */
public class ResourceNotFoundException extends AuthException {

    public ResourceNotFoundException(String resource, String identifier) {
        super(String.format("%s not found: %s", resource, identifier), HttpStatus.NOT_FOUND, "NOT_FOUND");
    }

    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "NOT_FOUND");
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id), HttpStatus.NOT_FOUND, "NOT_FOUND");
    }
}
