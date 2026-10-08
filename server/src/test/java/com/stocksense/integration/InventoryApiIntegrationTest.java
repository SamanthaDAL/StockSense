package com.stocksense.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.Location;
import com.stocksense.domain.Product;
import com.stocksense.domain.StockMovement;
import com.stocksense.domain.StockMovementType;
import com.stocksense.repository.InventoryRecordRepository;
import com.stocksense.repository.LocationRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.StockMovementRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class InventoryApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private InventoryRecordRepository inventoryRecordRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Test
    void stockInEndpointShouldPersistQuantityAndMovement()
            throws Exception {

        Product product = productRepository.save(
                new Product(
                        "API-INT-001",
                        "API Integration Product",
                        "Testing",
                        5
                )
        );

        Location location = locationRepository.save(
                new Location(
                        "API-MAIN",
                        "API Main Location"
                )
        );

        InventoryRecord record =
                inventoryRecordRepository.save(
                        new InventoryRecord(
                                product,
                                location,
                                3
                        )
                );

        mockMvc.perform(
                post("/api/inventory/stock-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sku": "API-INT-001",
                                  "locationCode": "API-MAIN",
                                  "amount": 5
                                }
                                """)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.sku")
                .value("API-INT-001"))
        .andExpect(jsonPath("$.locationCode")
                .value("API-MAIN"))
        .andExpect(jsonPath("$.quantity")
                .value(8));

        InventoryRecord updated =
                inventoryRecordRepository
                        .findByProductSkuAndLocationCode(
                                "API-INT-001",
                                "API-MAIN"
                        )
                        .orElseThrow();

        assertEquals(8, updated.getQuantity());

        List<StockMovement> movements =
                stockMovementRepository
                        .findByInventoryRecordIdOrderByCreatedAtDesc(
                                record.getId()
                        );

        assertEquals(1, movements.size());
        assertEquals(
                StockMovementType.STOCK_IN,
                movements.get(0).getType()
        );
        assertEquals(
                5,
                movements.get(0).getQuantityDelta()
        );
    }
}