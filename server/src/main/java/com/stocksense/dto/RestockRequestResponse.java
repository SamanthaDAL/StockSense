package com.stocksense.dto;

import com.stocksense.domain.RestockRequestStatus;

public class RestockRequestResponse {

    private final Long id;
    private final String sku;
    private final String locationCode;
    private final int requestedQuantity;
    private final RestockRequestStatus status;

    public RestockRequestResponse(
            Long id,
            String sku,
            String locationCode,
            int requestedQuantity,
            RestockRequestStatus status) {

        this.id = id;
        this.sku = sku;
        this.locationCode = locationCode;
        this.requestedQuantity = requestedQuantity;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public RestockRequestStatus getStatus() {
        return status;
    }
}