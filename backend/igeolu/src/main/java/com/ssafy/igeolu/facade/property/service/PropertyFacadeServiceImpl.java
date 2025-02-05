package com.ssafy.igeolu.facade.property.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.option.repository.OptionRepository;
import com.ssafy.igeolu.domain.option.service.OptionService;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.entity.PropertyImage;
import com.ssafy.igeolu.domain.property.service.PropertyService;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.file.service.FileService;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.util.CoordinateConverter;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PropertyFacadeServiceImpl implements PropertyFacadeService {

	private final PropertyService propertyService;
	private final DongcodesService dongcodesService;
	private final OptionService optionService;
	private final CoordinateConverter coordinateConverter;
	private final OptionRepository optionRepository;
	private final UserService userService;
	private final FileService fileService;

	@Override
	public void createProperty(PropertyPostRequestDto request, List<MultipartFile> images) {

		// 좌표 변환
		double[] latLon = coordinateConverter.convertToLatLon(
			Double.parseDouble(request.getX()),
			Double.parseDouble(request.getY())
		);

		// 타입 변환
		BigDecimal latitude = BigDecimal.valueOf(latLon[0]);
		BigDecimal longitude = BigDecimal.valueOf(latLon[1]);

		// Dongcodes dongcode = dongcodesService.getDongcodes(request.getDongcode());

		// 옵션 ID 리스트로 Option 엔티티들 조회
		List<Option> options = optionRepository.findByIdIn(request.getOptions());

		User user = userService.getUserById(1);

		Property property = Property.builder()
			.description(request.getDescription())
			.deposit(request.getDeposit())
			.monthlyRent(request.getMonthlyRent())
			.area(request.getArea())
			.approvalDate(request.getApprovalDate())
			.currentFloor(request.getCurrentFloor())
			.totalFloors(request.getTotalFloors())
			.address(request.getAddress())
			.latitude(latitude)
			.longitude(longitude)
			// .dongcode(dongcode)
			.user(user)
			.build();

		// PropertyOption 생성 및 연관관계 설정
		options.forEach(option -> {
			PropertyOption propertyOption = new PropertyOption(property, option);
			property.addPropertyOption(propertyOption);
		});

		// 이미지 저장
		images.forEach(i -> {
			String filePath = fileService.saveFile(i);
			PropertyImage propertyImage = PropertyImage.builder()
				.filePath(filePath)
				.build();
			property.addPropertyImage(propertyImage);
		});

		propertyService.createProperty(property);
	}

	@Override
	public List<PropertyGetResponseDto> getProperties(Integer userId) {
		User user = userService.getUserById(userId);
		List<Property> properties = propertyService.getPropertyList(user);

		if (properties.isEmpty()) {
			throw new CustomException(ErrorCode.PROPERTY_NOT_FOUND);
		}

		return properties.stream()
			.map(this::changeToDto)
			.collect(Collectors.toList());
	}

	private PropertyGetResponseDto changeToDto(Property property) {

		List<PropertyGetResponseDto.OptionDto> optionDtos = property.getPropertyOptions().stream()
			.map(PropertyOption::getOption)
			.map(option -> new PropertyGetResponseDto.OptionDto(option.getId(), option.getName().getLabel()))
			.toList();

		List<String> images = property.getPropertyImages().stream()
			.map(PropertyImage::getFilePath)
			.toList();

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

	@Override
	public PropertyGetResponseDto getProperty(Integer propertyId) {

		Property property = propertyService.getProperty(propertyId);
		return changeToDto(property);
	}

	@Override
	public List<OptionListGetResponseDto> getOptionList() {
		List<Option> options = optionService.getOptionList();

		return options.stream()
			.map(option -> new OptionListGetResponseDto(
				option.getId(),
				option.getName().getLabel()
			))
			.collect(Collectors.toList());

	}
}


