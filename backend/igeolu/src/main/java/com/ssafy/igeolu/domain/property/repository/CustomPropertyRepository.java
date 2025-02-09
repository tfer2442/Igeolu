package com.ssafy.igeolu.domain.property.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.ssafy.igeolu.domain.property.entity.EsProperty;

public interface CustomPropertyRepository {

	List<EsProperty> findBy(String keyword,
		String sidoName,
		String gugunName,
		String dongName,
		Integer maxDeposit,
		Integer maxMonthlyRent,
		List<Integer> optionIds,
		Pageable pageable);
}
