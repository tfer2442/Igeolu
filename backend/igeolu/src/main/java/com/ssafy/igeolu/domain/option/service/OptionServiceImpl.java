package com.ssafy.igeolu.domain.option.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.option.repository.OptionRepository;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.repository.PropertyRepository;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;

import jakarta.el.PropertyNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionServiceImpl implements OptionService {

	private final PropertyRepository propertyRepository;


	@Override
	public List<Option> getOptionFromPropertyOptions(List<PropertyOption> propertyOptions) {
		return propertyOptions.stream()
			.map(PropertyOption::getOption)
			.collect(Collectors.toList());

	}
}
