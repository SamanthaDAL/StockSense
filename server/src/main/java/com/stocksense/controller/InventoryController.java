package com.stocksense.controller;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.dto.AdjustmentRequest;
import com.stocksense.dto.InventoryRecordRequest;
import com.stocksense.dto.InventoryRecordResponse;
import com.stocksense.dto.StockMovementRequest;
import com.stocksense.dto.StockMovementResponse;
import com.stocksense.service.InventoryService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://df1sfwtnul5fy.cloudfront.net"
})
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/records")
    public InventoryRecordResponse createInventoryRecord(
            @RequestBody InventoryRecordRequest request) {

        Product product =
                inventoryService.findProductBySku(request.getSku());

        if (product == null) {
            throw new IllegalArgumentException("Product not found.");
        }

        Location location = new Location(
                request.getLocationCode(),
                request.getLocationName()
        );

        InventoryRecord record =
                inventoryService.createInventoryRecord(
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
            @Valid @RequestBody StockMovementRequest request) {

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

    @PostMapping("/adjust")
    public InventoryRecordResponse adjustQuantity(
            @RequestBody AdjustmentRequest request) {

        InventoryRecord record = inventoryService.adjustQuantity(
                request.getSku(),
                request.getLocationCode(),
                request.getNewQuantity()
        );

        return new InventoryRecordResponse(
                record.getProduct().getSku(),
                record.getLocation().getCode(),
                record.getQuantity()
        );
    }

    @GetMapping("/records")
        public List<InventoryRecordResponse> getInventoryRecords() {

        return inventoryService.getInventoryRecords()
                .stream()
                .map(record -> new InventoryRecordResponse(
                        record.getProduct().getSku(),
                        record.getLocation().getCode(),
                        record.getQuantity()
                ))
                .toList();
        }

    @GetMapping("/low-stock")
    public List<InventoryRecordResponse> getLowStockRecords() {

        return inventoryService.getLowStockRecords()
                .stream()
                .map(record -> new InventoryRecordResponse(
                        record.getProduct().getSku(),
                        record.getLocation().getCode(),
                        record.getQuantity()
                ))
                .toList();
    }

    @GetMapping("/search")
    public List<InventoryRecordResponse> searchInventory(
            @RequestParam(name = "text", required = false) String text,
            @RequestParam(name = "category", required = false) String category) {

        return inventoryService.searchInventory(text, category)
                .stream()
                .map(record -> new InventoryRecordResponse(
                        record.getProduct().getSku(),
                        record.getLocation().getCode(),
                        record.getQuantity()
                ))
                .toList();
    }

    @GetMapping("/movements")
    public List<StockMovementResponse> getMovementHistory(
            @RequestParam("sku") String sku,
            @RequestParam("locationCode") String locationCode) {

        return inventoryService
                .getMovementsForRecord(sku, locationCode)
                .stream()
                .map(movement -> new StockMovementResponse(
                        movement.getInventoryRecord()
                                .getProduct()
                                .getSku(),
                        movement.getInventoryRecord()
                                .getLocation()
                                .getCode(),
                        movement.getType().name(),
                        movement.getQuantityDelta(),
                        movement.getCreatedAt()
                ))
                .toList();
    }
}