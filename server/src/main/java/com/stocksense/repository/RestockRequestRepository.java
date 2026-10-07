package com.stocksense.repository;

import com.stocksense.domain.RestockRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestockRequestRepository
        extends JpaRepository<RestockRequest, Long> {
}