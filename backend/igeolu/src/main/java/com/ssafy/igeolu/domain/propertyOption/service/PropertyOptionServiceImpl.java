package com.ssafy.igeolu.domain.propertyOption.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;
import com.ssafy.igeolu.domain.propertyOption.repository.PropertyOptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyOptionServiceImpl implements PropertyOptionService {

	private final PropertyOptionRepository propertyOptionRepository;

	@Override
	public List<Option> getOptionList (Integer propertyId) {
		
		// 특정 매물에 있는 옵션 조회
		List<PropertyOption> propertyOptions = propertyOptionRepository.findByPropertyId(propertyId);

		return propertyOptions.stream()
			.map(PropertyOption::getOption)
			.collect(Collectors.toList());



	}

	@Transactional
	@Override
	public void savePropertyOptions(Property property, List<Option> options) {
		// 기존 옵션들 삭제
		propertyOptionRepository.deleteByPropertyId(property.getId());

		// 새로운 옵션들 저장
		List<PropertyOption> propertyOptions = options.stream()
			.map(option -> new PropertyOption(property, option))
			.collect(Collectors.toList());

		propertyOptionRepository.saveAll(propertyOptions);


	}
}

