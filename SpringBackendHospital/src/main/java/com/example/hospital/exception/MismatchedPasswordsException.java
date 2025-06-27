package com.example.hospital.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.EXPECTATION_FAILED)
public class MismatchedPasswordsException extends RuntimeException {
    public MismatchedPasswordsException(String message) {
        super(message);
    }
}
