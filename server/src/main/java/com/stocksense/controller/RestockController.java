package com.stocksense.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stocksense.domain.RestockRequest;
import com.stocksense.dto.RestockRequestCreateRequest;
import com.stocksense.dto.RestockRequestResponse;
import com.stocksense.service.RestockService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restocks")
public class RestockController {

    private final RestockService restockService;

    public RestockController(RestockService restockService) {
        this.restockService = restockService;
    }

    @PostMapping
    public RestockRequestResponse create(
            @Valid @RequestBody RestockRequestCreateRequest request) {

        return toResponse(
                restockService.create(
                        request.getSku(),
                        request.getLocationCode(),
                        request.getRequestedQuantity()
                )
        );
    }

    @GetMapping
    public List<RestockRequestResponse> getAll() {
        return restockService.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping("/{id}/approve")
    public RestockRequestResponse approve(
            @PathVariable Long id) {

        return toResponse(restockService.approve(id));
    }

    @PostMapping("/{id}/order")
    public RestockRequestResponse markOrdered(
            @PathVariable Long id) {

        return toResponse(restockService.markOrdered(id));
    }

    @PostMapping("/{id}/receive")
    public RestockRequestResponse markReceived(
            @PathVariable Long id) {

        return toResponse(restockService.markReceived(id));
    }

    @PostMapping("/{id}/cancel")
    public RestockRequestResponse cancel(
            @PathVariable Long id) {

        return toResponse(restockService.cancel(id));
    }

    private RestockRequestResponse toResponse(
            RestockRequest request) {

        return new RestockRequestResponse(
                request.getId(),
                request.getInventoryRecord().getProduct().getSku(),
                request.getInventoryRecord().getLocation().getCode(),
                request.getRequestedQuantity(),
                request.getStatus()
        );
    }
}