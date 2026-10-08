package com.stocksense.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.stocksense.domain.Product;
import com.stocksense.repository.ProductRepository;

@SpringBootTest
@Transactional
class ProductPersistenceIntegrationTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    void productShouldPersistAndBeReadBack() {
        Product product = new Product(
                "INT-001",
                "Integration Test Product",
                "Testing",
                4
        );

        Product saved = productRepository.save(product);

        Product found = productRepository
                .findBySku("INT-001")
                .orElseThrow();

        assertNotNull(saved.getId());
        assertEquals("INT-001", found.getSku());
        assertEquals(
                "Integration Test Product",
                found.getName()
        );
        assertEquals(4, found.getReorderLevel());
    }
}