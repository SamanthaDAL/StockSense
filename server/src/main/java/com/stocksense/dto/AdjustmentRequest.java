package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class AdjustmentRequest {

    @NotBlank(message = "SKU must not be blank.")
    private String sku;

    @NotBlank(message = "Location code must not be blank.")
    private String locationCode;

    @PositiveOrZero(message = "New quantity must not be negative.")
    private int newQuantity;

    public AdjustmentRequest() {
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

    public int getNewQuantity() {
        return newQuantity;
    }

    public void setNewQuantity(int newQuantity) {
        this.newQuantity = newQuantity;
    }
}