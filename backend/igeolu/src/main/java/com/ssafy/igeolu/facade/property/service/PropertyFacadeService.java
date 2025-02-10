package com.ssafy.igeolu.facade.property.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertySearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyUpdateRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.SigunguSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertySearchGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.SigunguSearchGetResponseDto;

public interface PropertyFacadeService {

	void createProperty(PropertyPostRequestDto propertyPostRequestDto, List<MultipartFile> images);

	List<PropertyGetResponseDto> getProperties(Integer userId);

	PropertyGetResponseDto getProperty(Integer propertyId);

	List<OptionListGetResponseDto> getOptionList();

	void updateProperty(Integer propertyId, PropertyUpdateRequestDto requestDto, List<MultipartFile> images);

	List<PropertyGetResponseDto> getPropertiesByDongcode(String dongcode);

	List<String> getSidoList();

	List<String> getGugunList(String sidoName);

	List<DongResponseDto> getDongList(String sidoName, String gugunName);

	void deleteProperty(Integer propertyId);

	List<PropertySearchGetResponseDto> searchBy(PropertySearchGetRequestDto request);

	List<SigunguSearchGetResponseDto> searchSigunguBy(SigunguSearchGetRequestDto request);
}
