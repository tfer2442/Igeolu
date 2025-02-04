package com.ssafy.igeolu.facade.property.service;

import java.util.List;

import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

public interface PropertyFacadeService {

	void createProperty(PropertyPostRequestDto propertyPostRequestDto);

	// List<PropertyGetResponseDto> getProperties(Integer userId);
}
