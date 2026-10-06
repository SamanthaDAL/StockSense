package com.stocksense.controller;

import com.stocksense.domain.Product;
import com.stocksense.dto.ProductRequest;
import com.stocksense.dto.ProductResponse;
import com.stocksense.service.InventoryService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final InventoryService inventoryService;

    public ProductController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ProductResponse createProduct(@RequestBody ProductRequest request) {

        Product product = new Product(
                request.getSku(),
                request.getName(),
                request.getCategory(),
                request.getReorderLevel()
        );

        inventoryService.addProduct(product);

        return new ProductResponse(
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getReorderLevel()
        );
    }

    @GetMapping
    public List<ProductResponse> getProducts() {
        return inventoryService.getProducts()
                .stream()
                .map(product -> new ProductResponse(
                        product.getSku(),
                        product.getName(),
                        product.getCategory(),
                        product.getReorderLevel()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/{sku}")
    public ProductResponse getProductBySku(@PathVariable("sku") String sku) {
        Product product = inventoryService.findProductBySku(sku);

        if (product == null) {
            return null;
        }

        return new ProductResponse(
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getReorderLevel()
        );
    }
}