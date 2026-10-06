package com.stocksense.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private int reorderLevel;

    protected Product() {
    }

    public Product(String sku, String name, String category, int reorderLevel) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU must not be blank.");
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be blank.");
        }

        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category must not be blank.");
        }

        if (reorderLevel < 0) {
            throw new IllegalArgumentException("Reorder level must not be negative.");
        }

        this.sku = sku;
        this.name = name;
        this.category = category;
        this.reorderLevel = reorderLevel;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }
}