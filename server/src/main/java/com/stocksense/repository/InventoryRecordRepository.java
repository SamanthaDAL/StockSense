package com.stocksense.repository;

import com.stocksense.domain.InventoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRecordRepository extends JpaRepository<InventoryRecord, Long> {

    Optional<InventoryRecord> findByProductSkuAndLocationCode(
            String sku,
            String locationCode
    );
}