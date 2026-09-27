package com.stocksense.domain;

public class Product {

    private String sku;
    private String name;
    private String category;
    private int reorderLevel;

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