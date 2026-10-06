package com.stocksense.repository;

import com.stocksense.domain.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByInventoryRecordIdOrderByCreatedAtDesc(Long inventoryRecordId);
}