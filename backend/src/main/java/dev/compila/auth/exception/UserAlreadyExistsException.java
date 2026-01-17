package dev.compila.auth.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when attempting to register a user with an already
 * existing username or email.
 */
public class UserAlreadyExistsException extends AuthException {

    public UserAlreadyExistsException(String field, String value) {
        super(String.format("User with %s '%s' already exists", field, value), HttpStatus.CONFLICT, "USER_EXISTS");
    }

    public UserAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT, "USER_EXISTS");
    }
}
