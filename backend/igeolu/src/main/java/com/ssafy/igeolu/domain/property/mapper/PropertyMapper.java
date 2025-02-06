package com.ssafy.igeolu.domain.property.mapper;

import java.util.List;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.entity.PropertyImage;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

public class PropertyMapper {

	// Property → PropertyGetResponseDto 변환
	public static PropertyGetResponseDto toDto(Property property) {
		if (property == null) {
			return null;
		}

		// 1) 옵션 DTO 리스트 추출
		List<PropertyGetResponseDto.OptionDto> optionDtos = property.getPropertyOptions().stream()
			.map(PropertyOption::getOption)
			.map(option -> new PropertyGetResponseDto.OptionDto(option.getId(), option.getName().getLabel()))
			.toList();

		// 2) 이미지 파일 경로 리스트 추출
		List<String> images = property.getPropertyImages().stream()
			.map(PropertyImage::getFilePath)
			.toList();

		// 3) 빌더를 통해 DTO 생성 후 반환
		return PropertyGetResponseDto.builder()
			.propertyId(property.getId())
			.description(property.getDescription())
			.deposit(property.getDeposit())
			.monthlyRent(property.getMonthlyRent())
			.area(property.getArea())
			.approvalDate(property.getApprovalDate())
			.currentFloor(property.getCurrentFloor())
			.totalFloors(property.getTotalFloors())
			.address(property.getAddress())
			.latitude(property.getLatitude())
			.longitude(property.getLongitude())
			.options(optionDtos)
			.images(images)
			.build();
	}
}
