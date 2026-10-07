package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class RestockRequestCreateRequest {

    @NotBlank(message = "SKU must not be blank.")
    private String sku;

    @NotBlank(message = "Location code must not be blank.")
    private String locationCode;

    @Positive(message = "Requested quantity must be greater than zero.")
    private int requestedQuantity;

    public RestockRequestCreateRequest() {
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

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(int requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }
}