package com.stocksense.dto;

import java.time.LocalDateTime;

public class StockMovementResponse {

    private final String sku;
    private final String locationCode;
    private final String type;
    private final int quantityDelta;
    private final LocalDateTime createdAt;

    public StockMovementResponse(
            String sku,
            String locationCode,
            String type,
            int quantityDelta,
            LocalDateTime createdAt) {

        this.sku = sku;
        this.locationCode = locationCode;
        this.type = type;
        this.quantityDelta = quantityDelta;
        this.createdAt = createdAt;
    }

    public String getSku() {
        return sku;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public String getType() {
        return type;
    }

    public int getQuantityDelta() {
        return quantityDelta;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}