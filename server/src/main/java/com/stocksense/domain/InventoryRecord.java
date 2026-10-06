package com.stocksense.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class InventoryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    private int quantity;

    protected InventoryRecord() {
    }

    public InventoryRecord(Product product, Location location, int quantity) {
        if (product == null) {
            throw new IllegalArgumentException("Product must not be null.");
        }

        if (location == null) {
            throw new IllegalArgumentException("Location must not be null.");
        }

        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity must not be negative.");
        }

        this.product = product;
        this.location = location;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public Location getLocation() {
        return location;
    }

    public int getQuantity() {
        return quantity;
    }

    public void stockIn(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Stock-in amount must be greater than zero.");
        }

        quantity += amount;
    }

    public void stockOut(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Stock-out amount must be greater than zero.");
        }

        if (amount > quantity) {
            throw new IllegalArgumentException("Stock-out amount exceeds available quantity.");
        }

        quantity -= amount;
    }

    public void adjustQuantity(int newQuantity) {
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Adjusted quantity must not be negative.");
        }

        quantity = newQuantity;
    }
}