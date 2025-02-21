package com.ssafy.igeolu.domain.propertyOption.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;

@Repository
public interface PropertyOptionRepository extends JpaRepository<PropertyOption, Integer>{

	List<PropertyOption> findByPropertyId(Integer propertyId);

	void deleteByPropertyId(Integer propertyId);
}
