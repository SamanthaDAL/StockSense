package com.stocksense.domain;

public class Location {

    private String code;
    private String name;

    public Location(String code, String name) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Location code must not be blank.");
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Location name must not be blank.");
        }

        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}