package com.stocksense.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.domain.StockMovement;
import com.stocksense.domain.StockMovementType;
import com.stocksense.repository.InventoryRecordRepository;
import com.stocksense.repository.LocationRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.StockMovementRepository;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private InventoryRecordRepository inventoryRecordRepository;

    @Mock
    private StockMovementRepository stockMovementRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void stockInShouldSaveQuantityAndMovement() {
        Product product = new Product(
                "TEST-001",
                "Test Product",
                "Testing",
                5
        );

        Location location = new Location(
                "MAIN",
                "Main Location"
        );

        InventoryRecord record =
                new InventoryRecord(product, location, 10);

        when(inventoryRecordRepository
                .findByProductSkuAndLocationCode(
                        "TEST-001",
                        "MAIN"
                ))
                .thenReturn(Optional.of(record));

        when(inventoryRecordRepository.save(record))
                .thenReturn(record);

        InventoryRecord result =
                inventoryService.stockIn(
                        "TEST-001",
                        "MAIN",
                        5
                );

        assertEquals(15, result.getQuantity());

        verify(inventoryRecordRepository).save(record);

        ArgumentCaptor<StockMovement> movementCaptor =
                ArgumentCaptor.forClass(StockMovement.class);

        verify(stockMovementRepository)
                .save(movementCaptor.capture());

        StockMovement movement = movementCaptor.getValue();

        assertEquals(
                StockMovementType.STOCK_IN,
                movement.getType()
        );

        assertEquals(
                5,
                movement.getQuantityDelta()
        );
    }

    @Test
    void stockInShouldCreateInventoryRecordWhenMissing() {
        Product product = new Product(
                "NEW-001",
                "New Product",
                "Testing",
                5
        );

        Location location = new Location(
                "NEW-WH",
                "New Warehouse"
        );

        when(inventoryRecordRepository
                .findByProductSkuAndLocationCode(
                        "NEW-001",
                        "NEW-WH"
                ))
                .thenReturn(Optional.empty());

        when(productRepository.findBySku("NEW-001"))
                .thenReturn(Optional.of(product));

        when(locationRepository.findByCode("NEW-WH"))
                .thenReturn(Optional.of(location));

        when(inventoryRecordRepository.save(any(InventoryRecord.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        InventoryRecord result =
                inventoryService.stockIn(
                        "NEW-001",
                        "NEW-WH",
                        4
                );

        assertEquals(4, result.getQuantity());

        verify(productRepository)
                .findBySku("NEW-001");

        verify(locationRepository)
                .findByCode("NEW-WH");

        verify(inventoryRecordRepository, times(2))
                .save(any(InventoryRecord.class));

        ArgumentCaptor<StockMovement> movementCaptor =
                ArgumentCaptor.forClass(StockMovement.class);

        verify(stockMovementRepository)
                .save(movementCaptor.capture());

        StockMovement movement = movementCaptor.getValue();

        assertEquals(
                StockMovementType.STOCK_IN,
                movement.getType()
        );

        assertEquals(
                4,
                movement.getQuantityDelta()
        );
    }

    @Test
    void lowStockShouldComeFromRepository() {
        Product product = new Product(
                "LOW-TEST",
                "Low Test Product",
                "Testing",
                5
        );

        Location location = new Location(
                "MAIN",
                "Main Location"
        );

        InventoryRecord record =
                new InventoryRecord(product, location, 3);

        List<InventoryRecord> expected =
                List.of(record);

        when(inventoryRecordRepository.findLowStock())
                .thenReturn(expected);

        List<InventoryRecord> result =
                inventoryService.getLowStockRecords();

        assertSame(expected, result);

        verify(inventoryRecordRepository).findLowStock();
    }
}