package com.stocksense.service;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.repository.InventoryRecordRepository;
import com.stocksense.repository.LocationRepository;
import com.stocksense.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final InventoryRecordRepository inventoryRecordRepository;

    public InventoryService(
            ProductRepository productRepository,
            LocationRepository locationRepository,
            InventoryRecordRepository inventoryRecordRepository) {

        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.inventoryRecordRepository = inventoryRecordRepository;
    }

    public void addProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product must not be null.");
        }

        productRepository.save(product);
    }

    public Product findProductBySku(String sku) {
        return productRepository.findBySku(sku).orElse(null);
    }

    public InventoryRecord createInventoryRecord(
            Product product,
            Location location,
            int quantity) {

        Location savedLocation = locationRepository
                .findByCode(location.getCode())
                .orElseGet(() -> locationRepository.save(location));

        InventoryRecord record = new InventoryRecord(
                product,
                savedLocation,
                quantity
        );

        return inventoryRecordRepository.save(record);
    }

    public InventoryRecord findInventoryRecord(
            String sku,
            String locationCode) {

        return inventoryRecordRepository
                .findByProductSkuAndLocationCode(sku, locationCode)
                .orElse(null);
    }

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public List<InventoryRecord> getInventoryRecords() {
        return inventoryRecordRepository.findAll();
    }

    public InventoryRecord stockIn(
        String sku,
        String locationCode,
        int amount) {

        InventoryRecord record = findInventoryRecord(sku, locationCode);

        if (record == null) {
            throw new IllegalArgumentException("Inventory record not found.");
        }

        record.stockIn(amount);

        return inventoryRecordRepository.save(record);
    }

    public InventoryRecord stockOut(
            String sku,
            String locationCode,
            int amount) {

        InventoryRecord record = findInventoryRecord(sku, locationCode);

        if (record == null) {
            throw new IllegalArgumentException("Inventory record not found.");
        }

        record.stockOut(amount);

        return inventoryRecordRepository.save(record);
    }
}