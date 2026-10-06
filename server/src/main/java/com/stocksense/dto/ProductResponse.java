package com.stocksense.dto;

public class ProductResponse {

    private String sku;
    private String name;
    private String category;
    private int reorderLevel;

    public ProductResponse(
            String sku,
            String name,
            String category,
            int reorderLevel) {

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