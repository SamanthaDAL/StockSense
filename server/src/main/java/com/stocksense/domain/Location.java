package com.stocksense.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    protected Location() {
    }

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

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}