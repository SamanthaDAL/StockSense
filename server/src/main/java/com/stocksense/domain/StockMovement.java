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
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_record_id", nullable = false)
    private InventoryRecord inventoryRecord;

    @Enumerated(EnumType.STRING)
    private StockMovementType type;

    private int quantityDelta;

    private LocalDateTime createdAt;

    protected StockMovement() {
    }

    public StockMovement(
            InventoryRecord inventoryRecord,
            StockMovementType type,
            int quantityDelta) {

        if (inventoryRecord == null) {
            throw new IllegalArgumentException("Inventory record must not be null.");
        }

        if (type == null) {
            throw new IllegalArgumentException("Stock movement type must not be null.");
        }

        if (quantityDelta == 0) {
            throw new IllegalArgumentException("Quantity delta must not be zero.");
        }

        this.inventoryRecord = inventoryRecord;
        this.type = type;
        this.quantityDelta = quantityDelta;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public InventoryRecord getInventoryRecord() {
        return inventoryRecord;
    }

    public StockMovementType getType() {
        return type;
    }

    public int getQuantityDelta() {
        return quantityDelta;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}