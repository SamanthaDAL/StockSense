package com.stocksense.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI stockSenseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("StockSense API")
                        .description(
                                "REST API for product inventory, stock movements, low-stock insights and restock workflows."
                        )
                        .version("v1"));
    }
}