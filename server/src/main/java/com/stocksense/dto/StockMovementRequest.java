package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class StockMovementRequest {

    @NotBlank(message = "SKU must not be blank.")
    private String sku;

    @NotBlank(message = "Location code must not be blank.")
    private String locationCode;

    @Positive(message = "Amount must be greater than zero.")
    private int amount;

    public StockMovementRequest() {
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}