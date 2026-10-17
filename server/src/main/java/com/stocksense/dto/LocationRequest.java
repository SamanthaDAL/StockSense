package com.stocksense.dto;

import jakarta.validation.constraints.NotBlank;

public record LocationRequest(

        @NotBlank(message = "Location code must not be blank.")
        String code,

        @NotBlank(message = "Location name must not be blank.")
        String name
) {
}