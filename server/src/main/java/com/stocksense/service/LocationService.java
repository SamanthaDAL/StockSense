package com.stocksense.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stocksense.domain.Location;
import com.stocksense.repository.LocationRepository;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAll() {
        return locationRepository.findAll();
    }

    @Transactional
    public Location create(String code, String name) {

        String normalizedCode = code.trim().toUpperCase();
        String normalizedName = name.trim();

        if (locationRepository.findByCode(normalizedCode).isPresent()) {
            throw new IllegalArgumentException(
                    "A location with this code already exists."
            );
        }

        Location location =
                new Location(normalizedCode, normalizedName);

        return locationRepository.save(location);
    }
}