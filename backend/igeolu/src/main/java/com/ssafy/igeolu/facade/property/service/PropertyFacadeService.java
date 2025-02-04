package com.ssafy.igeolu.facade.property.service;

import java.util.List;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

public interface PropertyFacadeService {

	void createProperty(PropertyPostRequestDto propertyPostRequestDto);

	List<PropertyGetResponseDto> getProperties(Integer userId);

	PropertyGetResponseDto getProperty(Integer propertyId);

	List<OptionListGetResponseDto> getOptionList();
}
