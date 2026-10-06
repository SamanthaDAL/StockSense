package com.stocksense.controller;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.dto.InventoryRecordRequest;
import com.stocksense.dto.InventoryRecordResponse;
import com.stocksense.dto.StockMovementRequest;
import com.stocksense.service.InventoryService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/records")
    public InventoryRecordResponse createInventoryRecord(
            @RequestBody InventoryRecordRequest request) {

        Product product = inventoryService.findProductBySku(request.getSku());

        if (product == null) {
            throw new IllegalArgumentException("Product not found.");
        }

        Location location = new Location(
                request.getLocationCode(),
                request.getLocationName()
        );

        InventoryRecord record = inventoryService.createInventoryRecord(
                product,
                location,
                request.getQuantity()
        );

        return new InventoryRecordResponse(
                product.getSku(),
                location.getCode(),
                record.getQuantity()
        );
    }

    @PostMapping("/stock-in")
    public InventoryRecordResponse stockIn(
        @RequestBody StockMovementRequest request) {
                InventoryRecord record = inventoryService.stockIn(
                        request.getSku(),
                        request.getLocationCode(),
                        request.getAmount()
                );

                return new InventoryRecordResponse(
                        record.getProduct().getSku(),
                        record.getLocation().getCode(),
                        record.getQuantity()
                );
        }

    @PostMapping("/stock-out")
    public InventoryRecordResponse stockOut(
        @RequestBody StockMovementRequest request) {

                InventoryRecord record = inventoryService.stockOut(
                        request.getSku(),
                        request.getLocationCode(),
                        request.getAmount()
                );

                return new InventoryRecordResponse(
                        record.getProduct().getSku(),
                        record.getLocation().getCode(),
                        record.getQuantity()
                );
        }
}