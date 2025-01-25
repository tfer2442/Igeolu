package com.ssafy.igeolu.domain.property.repository;

import com.ssafy.igeolu.domain.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
}
