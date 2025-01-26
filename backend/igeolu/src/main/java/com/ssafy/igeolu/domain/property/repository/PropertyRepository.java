package com.ssafy.igeolu.domain.property.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.property.entity.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
}
