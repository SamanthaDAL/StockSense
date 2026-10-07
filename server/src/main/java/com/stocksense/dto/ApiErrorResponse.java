package com.stocksense.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ApiErrorResponse {

    private final int status;
    private final String error;
    private final String message;
    private final LocalDateTime timestamp;
    private final Map<String, String> details;

    public ApiErrorResponse(
            int status,
            String error,
            String message,
            Map<String, String> details) {

        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.details = details;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}