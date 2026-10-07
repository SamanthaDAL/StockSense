package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class InventoryRecordRequest {

    @NotBlank(message = "SKU must not be blank.")
    private String sku;

    @NotBlank(message = "Location code must not be blank.")
    private String locationCode;

    @NotBlank(message = "Location name must not be blank.")
    private String locationName;

    @PositiveOrZero(message = "New quantity must not be negative.")
    private int quantity;

    public InventoryRecordRequest() {
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

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}