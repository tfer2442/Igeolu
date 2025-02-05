package com.ssafy.igeolu.facade.property.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyUpdateRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

public interface PropertyFacadeService {

	void createProperty(PropertyPostRequestDto propertyPostRequestDto, List<MultipartFile> images);

	List<PropertyGetResponseDto> getProperties(Integer userId);

	PropertyGetResponseDto getProperty(Integer propertyId);

	List<OptionListGetResponseDto> getOptionList();

	void updateProperty(Integer propertyId, PropertyUpdateRequestDto requestDto, List<MultipartFile> images);
}
