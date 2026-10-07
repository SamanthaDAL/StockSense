package com.stocksense.repository;

import com.stocksense.domain.InventoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventoryRecordRepository
        extends JpaRepository<InventoryRecord, Long> {

    Optional<InventoryRecord> findByProductSkuAndLocationCode(
            String sku,
            String locationCode
    );

    @Query("""
            SELECT ir
            FROM InventoryRecord ir
            WHERE ir.quantity <= ir.product.reorderLevel
            ORDER BY ir.quantity ASC
            """)
    List<InventoryRecord> findLowStock();

    @Query("""
        SELECT ir
        FROM InventoryRecord ir
        WHERE (
            COALESCE(:text, '') = ''
            OR LOWER(ir.product.sku) LIKE LOWER(CONCAT('%', :text, '%'))
            OR LOWER(ir.product.name) LIKE LOWER(CONCAT('%', :text, '%'))
        )
        AND (
            COALESCE(:category, '') = ''
            OR LOWER(ir.product.category) = LOWER(:category)
        )
        ORDER BY ir.product.name ASC
        """)
    List<InventoryRecord> searchInventory(
            String text,
            String category
    );
}