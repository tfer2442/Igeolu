package com.ssafy.igeolu.domain.propertyOption.service;

import java.util.List;

import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.property.entity.Property;

public interface PropertyOptionService {

	List<Option> getOptionList (Integer propertyId);

	void savePropertyOptions(Property property, List<Option> options);
}
