package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class ProductUpdateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @PositiveOrZero
    private int reorderLevel;

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