package com.stocksense.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stocksense.domain.Location;
import com.stocksense.dto.LocationRequest;
import com.stocksense.dto.LocationResponse;
import com.stocksense.service.LocationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://df1sfwtnul5fy.cloudfront.net"
})
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<LocationResponse> getLocations() {

        return locationService.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public LocationResponse createLocation(
            @Valid @RequestBody LocationRequest request) {

        Location location = locationService.create(
                request.code(),
                request.name()
        );

        return toResponse(location);
    }

    private LocationResponse toResponse(Location location) {

        return new LocationResponse(
                location.getId(),
                location.getCode(),
                location.getName()
        );
    }
}