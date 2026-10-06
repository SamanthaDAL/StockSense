package com.stocksense.dto;

public class InventoryRecordResponse {

    private String sku;
    private String locationCode;
    private int quantity;

    public InventoryRecordResponse(
            String sku,
            String locationCode,
            int quantity) {

        this.sku = sku;
        this.locationCode = locationCode;
        this.quantity = quantity;
    }

    public String getSku() {
        return sku;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public int getQuantity() {
        return quantity;
    }
}