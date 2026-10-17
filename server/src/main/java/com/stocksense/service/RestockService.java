package com.stocksense.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stocksense.domain.InventoryRecord;
import com.stocksense.domain.RestockRequest;
import com.stocksense.repository.InventoryRecordRepository;
import com.stocksense.repository.RestockRequestRepository;

@Service
public class RestockService {

    private final RestockRequestRepository restockRequestRepository;
    private final InventoryRecordRepository inventoryRecordRepository;
    private final InventoryService inventoryService;

    public RestockService(
            RestockRequestRepository restockRequestRepository,
            InventoryRecordRepository inventoryRecordRepository,
            InventoryService inventoryService) {

        this.restockRequestRepository = restockRequestRepository;
        this.inventoryRecordRepository = inventoryRecordRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public RestockRequest create(
            String sku,
            String locationCode,
            int requestedQuantity) {

        InventoryRecord inventoryRecord =
                inventoryRecordRepository
                        .findByProductSkuAndLocationCode(sku, locationCode)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Inventory record not found."
                                )
                        );

        RestockRequest request =
                new RestockRequest(
                        inventoryRecord,
                        requestedQuantity
                );

        return restockRequestRepository.save(request);
    }

    public List<RestockRequest> getAll() {
        return restockRequestRepository.findAll();
    }

    @Transactional
    public RestockRequest approve(Long id) {
        RestockRequest request = findById(id);
        request.approve();
        return restockRequestRepository.save(request);
    }

    @Transactional
    public RestockRequest markOrdered(Long id) {
        RestockRequest request = findById(id);
        request.markOrdered();
        return restockRequestRepository.save(request);
    }

    @Transactional
    public RestockRequest markReceived(Long id) {
        RestockRequest request = findById(id);

        request.markReceived();

        inventoryService.stockIn(
                request.getInventoryRecord().getProduct().getSku(),
                request.getInventoryRecord().getLocation().getCode(),
                request.getRequestedQuantity()
        );

        return restockRequestRepository.save(request);
    }

    @Transactional
    public RestockRequest cancel(Long id) {
        RestockRequest request = findById(id);
        request.cancel();
        return restockRequestRepository.save(request);
    }

    private RestockRequest findById(Long id) {
        return restockRequestRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Restock request not found."
                        )
                );
    }
}