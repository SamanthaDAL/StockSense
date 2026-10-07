package com.stocksense.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class RestockRequestTest {

    private InventoryRecord createInventoryRecord() {
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

        return new InventoryRecord(product, location, 3);
    }

    @Test
    void newRequestShouldStartAsRequested() {
        RestockRequest request =
                new RestockRequest(
                        createInventoryRecord(),
                        10
                );

        assertEquals(
                RestockRequestStatus.REQUESTED,
                request.getStatus()
        );
    }

    @Test
    void requestShouldFollowValidLifecycle() {
        RestockRequest request =
                new RestockRequest(
                        createInventoryRecord(),
                        10
                );

        request.approve();
        assertEquals(
                RestockRequestStatus.APPROVED,
                request.getStatus()
        );

        request.markOrdered();
        assertEquals(
                RestockRequestStatus.ORDERED,
                request.getStatus()
        );

        request.markReceived();
        assertEquals(
                RestockRequestStatus.RECEIVED,
                request.getStatus()
        );
    }

    @Test
    void requestShouldRejectInvalidTransition() {
        RestockRequest request =
                new RestockRequest(
                        createInventoryRecord(),
                        10
                );

        assertThrows(
                IllegalStateException.class,
                request::markReceived
        );
    }

    @Test
    void receivedRequestShouldNotBeCancelled() {
        RestockRequest request =
                new RestockRequest(
                        createInventoryRecord(),
                        10
                );

        request.approve();
        request.markOrdered();
        request.markReceived();

        assertThrows(
                IllegalStateException.class,
                request::cancel
        );
    }
}