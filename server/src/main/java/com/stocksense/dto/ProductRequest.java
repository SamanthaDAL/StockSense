package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class ProductRequest {

    @NotBlank(message = "SKU must not be blank.")
    private String sku;

    @NotBlank(message = "Name must not be blank.")
    private String name;

    @NotBlank(message = "Category must not be blank.")
    private String category;

    @PositiveOrZero(message = "Reorder level must not be negative.")
    private int reorderLevel;

    public ProductRequest() {
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
}