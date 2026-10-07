package com.stocksense.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class RestockRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_record_id", nullable = false)
    private InventoryRecord inventoryRecord;

    private int requestedQuantity;

    @Enumerated(EnumType.STRING)
    private RestockRequestStatus status;

    private LocalDateTime createdAt;

    protected RestockRequest() {
    }

    public RestockRequest(
            InventoryRecord inventoryRecord,
            int requestedQuantity) {

        if (inventoryRecord == null) {
            throw new IllegalArgumentException(
                    "Inventory record must not be null."
            );
        }

        if (requestedQuantity <= 0) {
            throw new IllegalArgumentException(
                    "Requested quantity must be greater than zero."
            );
        }

        this.inventoryRecord = inventoryRecord;
        this.requestedQuantity = requestedQuantity;
        this.status = RestockRequestStatus.REQUESTED;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public InventoryRecord getInventoryRecord() {
        return inventoryRecord;
    }

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public RestockRequestStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void approve() {
        requireStatus(RestockRequestStatus.REQUESTED);
        status = RestockRequestStatus.APPROVED;
    }

    public void markOrdered() {
        requireStatus(RestockRequestStatus.APPROVED);
        status = RestockRequestStatus.ORDERED;
    }

    public void markReceived() {
        requireStatus(RestockRequestStatus.ORDERED);
        status = RestockRequestStatus.RECEIVED;
    }

    public void cancel() {
        if (status == RestockRequestStatus.RECEIVED ||
                status == RestockRequestStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Restock request cannot be cancelled from status " + status + "."
            );
        }

        status = RestockRequestStatus.CANCELLED;
    }

    private void requireStatus(RestockRequestStatus expectedStatus) {
        if (status != expectedStatus) {
            throw new IllegalStateException(
                    "Restock request must be " + expectedStatus +
                    " but is currently " + status + "."
            );
        }
    }
}