package com.stocksense.service;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;

import java.util.ArrayList;
import java.util.List;

public class InventoryService {

    private final List<Product> products = new ArrayList<>();
    private final List<InventoryRecord> inventoryRecords = new ArrayList<>();

    public void addProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product must not be null.");
        }

        products.add(product);
    }

    public Product findProductBySku(String sku) {
        for (Product product : products) {
            if (product.getSku().equals(sku)) {
                return product;
            }
        }

        return null;
    }

    public InventoryRecord createInventoryRecord(
            Product product,
            Location location,
            int quantity) {

        InventoryRecord record =
                new InventoryRecord(product, location, quantity);

        inventoryRecords.add(record);

        return record;
    }

    public List<Product> getProducts() {
        return new ArrayList<>(products);
    }

    public List<InventoryRecord> getInventoryRecords() {
        return new ArrayList<>(inventoryRecords);
    }
}