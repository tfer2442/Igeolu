package com.ssafy.igeolu.domain.property.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.igeolu.domain.property.entity.PropertyImage;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Integer> {

	@Query("SELECT pi.filePath FROM PropertyImage pi WHERE pi.property.id = :propertyId")
	List<String> findImagesByPropertyId(@Param("propertyId") Integer propertyId);
}
