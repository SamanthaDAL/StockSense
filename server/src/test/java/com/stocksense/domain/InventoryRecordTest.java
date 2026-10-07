package com.stocksense.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class InventoryRecordTest {

    @Test
    void stockInShouldIncreaseQuantity() {
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

        record.stockIn(5);

        assertEquals(15, record.getQuantity());
    }

    @Test
    void stockOutShouldDecreaseQuantity() {
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

        record.stockOut(4);

        assertEquals(6, record.getQuantity());
    }

    @Test
    void stockOutShouldRejectNegativeResult() {
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
                new InventoryRecord(product, location, 3);

        assertThrows(
                IllegalArgumentException.class,
                () -> record.stockOut(5)
        );
    }
}