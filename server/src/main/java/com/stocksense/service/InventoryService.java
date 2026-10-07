package com.stocksense.service;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.repository.InventoryRecordRepository;
import com.stocksense.repository.LocationRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.domain.StockMovement;
import com.stocksense.domain.StockMovementType;
import com.stocksense.repository.StockMovementRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final InventoryRecordRepository inventoryRecordRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryService(
            ProductRepository productRepository,
            LocationRepository locationRepository,
            InventoryRecordRepository inventoryRecordRepository,
            StockMovementRepository stockMovementRepository) {

        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.inventoryRecordRepository = inventoryRecordRepository;
        this.stockMovementRepository = stockMovementRepository;
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

    @Transactional
    public InventoryRecord stockIn(
            String sku,
            String locationCode,
            int amount) {

        InventoryRecord record = findInventoryRecord(sku, locationCode);

        if (record == null) {
            throw new IllegalArgumentException("Inventory record not found.");
        }

        record.stockIn(amount);
        InventoryRecord savedRecord = inventoryRecordRepository.save(record);

        StockMovement movement = new StockMovement(
                savedRecord,
                StockMovementType.STOCK_IN,
                amount
        );

        stockMovementRepository.save(movement);

        return savedRecord;
    }

    @Transactional
    public InventoryRecord stockOut(
            String sku,
            String locationCode,
            int amount) {

        InventoryRecord record = findInventoryRecord(sku, locationCode);

        if (record == null) {
            throw new IllegalArgumentException("Inventory record not found.");
        }

        record.stockOut(amount);
        InventoryRecord savedRecord = inventoryRecordRepository.save(record);

        StockMovement movement = new StockMovement(
                savedRecord,
                StockMovementType.STOCK_OUT,
                -amount
        );

        stockMovementRepository.save(movement);

        return savedRecord;
    }

    @Transactional
    public InventoryRecord adjustQuantity(
            String sku,
            String locationCode,
            int newQuantity) {

        InventoryRecord record = findInventoryRecord(sku, locationCode);

        if (record == null) {
            throw new IllegalArgumentException("Inventory record not found.");
        }

        int oldQuantity = record.getQuantity();
        int quantityDelta = newQuantity - oldQuantity;

        if (quantityDelta == 0) {
            throw new IllegalArgumentException(
                    "Adjusted quantity must be different from current quantity."
            );
        }

        record.adjustQuantity(newQuantity);

        InventoryRecord savedRecord =
                inventoryRecordRepository.save(record);

        StockMovement movement = new StockMovement(
                savedRecord,
                StockMovementType.ADJUSTMENT,
                quantityDelta
        );

        stockMovementRepository.save(movement);

        return savedRecord;
    }

    public List<InventoryRecord> getLowStockRecords() {
        return inventoryRecordRepository.findLowStock();
    }

    public List<InventoryRecord> searchInventory(
        String text,
        String category) {

        String normalizedText =
                text == null || text.isBlank() ? null : text.trim();

        String normalizedCategory =
                category == null || category.isBlank()
                        ? null
                        : category.trim();

        return inventoryRecordRepository.searchInventory(
                normalizedText,
                normalizedCategory
        );
    }
}