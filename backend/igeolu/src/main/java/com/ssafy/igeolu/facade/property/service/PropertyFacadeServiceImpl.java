package com.ssafy.igeolu.facade.property.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.file.service.FileService;
import com.ssafy.igeolu.domain.live.service.LivePropertyService;
import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.option.repository.OptionRepository;
import com.ssafy.igeolu.domain.option.service.OptionService;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.entity.PropertyImage;
import com.ssafy.igeolu.domain.property.service.PropertyService;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;
import com.ssafy.igeolu.domain.propertyOption.service.PropertyOptionService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertySearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyUpdateRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertySearchGetResponseDto;
import com.ssafy.igeolu.facade.property.mapper.PropertyMapper;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.global.util.CoordinateConverter;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PropertyFacadeServiceImpl implements PropertyFacadeService {

	private final PropertyService propertyService;
	private final DongcodesService dongcodesService;
	private final OptionService optionService;
	private final OptionRepository optionRepository;
	private final UserService userService;
	private final FileService fileService;
	private final PropertyOptionService propertyOptionService;
	private final SecurityService securityService;
	private final LivePropertyService livePropertyService;

	@Override
	public void createProperty(PropertyPostRequestDto request, List<MultipartFile> images) {

		// 좌표 변환
		double[] latLon = CoordinateConverter.convertToLatLon(
			Double.parseDouble(request.getX()),
			Double.parseDouble(request.getY())
		);

		// 타입 변환
		BigDecimal latitude = BigDecimal.valueOf(latLon[0]);
		BigDecimal longitude = BigDecimal.valueOf(latLon[1]);

		Dongcodes dongcode = dongcodesService.getDongcodes(request.getDongcode());

		// 옵션 ID 리스트로 Option 엔티티들 조회
		List<Option> options = optionRepository.findByIdIn(request.getOptions());

		User user = userService.getUserById(securityService.getCurrentUser().getUserId());

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
			.dongcode(dongcode)
			.user(user)
			.build();

		// PropertyOption 생성 및 연관관계 설정
		options.forEach(option -> {
			PropertyOption propertyOption = new PropertyOption(property, option);
			property.addPropertyOption(propertyOption);
		});

		// 이미지 저장
		if (images != null && !images.isEmpty()) {
			images.forEach(i -> {
				String filePath = fileService.saveFile(i);
				PropertyImage propertyImage = PropertyImage.builder()
					.filePath(filePath)
					.build();
				property.addPropertyImage(propertyImage);
			});
		}
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
			.map(PropertyMapper::toDto)
			.collect(Collectors.toList());
	}

	@Override
	public PropertyGetResponseDto getProperty(Integer propertyId) {

		Property property = propertyService.getProperty(propertyId);
		return PropertyMapper.toDto(property);
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

	@Override
	public void updateProperty(Integer propertyId, PropertyUpdateRequestDto requestDto, List<MultipartFile> images) {
		Property property = propertyService.getProperty(propertyId);

		Integer currentUserId = securityService.getCurrentUser().getUserId();

		// 매물 소유자와 현재 사용자가 다르면 예외 발생
		if (!property.getUser().getId().equals(currentUserId)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}

		// dongcode 업데이트 추가
		if (requestDto.getDongcode() != null) {
			Dongcodes dongcode = dongcodesService.getDongcodes(requestDto.getDongcode());
			property.setDongcode(dongcode);
		}

		// 좌표 변환
		double[] latLon = CoordinateConverter.convertToLatLon(
			Double.parseDouble(requestDto.getX()),
			Double.parseDouble(requestDto.getY())
		);

		// 타입 변환
		BigDecimal latitude = BigDecimal.valueOf(latLon[0]);
		BigDecimal longitude = BigDecimal.valueOf(latLon[1]);

		// 옵션 리스트로 엔티티 조회
		List<Option> options = optionRepository.findByIdIn(requestDto.getOptions());

		// 비우고 다시 저장
		propertyOptionService.savePropertyOptions(property, options);

		// 매물 정보 업데이트
		property.setDescription(requestDto.getDescription());
		property.setDeposit(requestDto.getDeposit());
		property.setMonthlyRent(requestDto.getMonthlyRent());
		property.setArea(requestDto.getArea());
		property.setApprovalDate(requestDto.getApprovalDate());
		property.setCurrentFloor(requestDto.getCurrentFloor());
		property.setTotalFloors(requestDto.getTotalFloors());
		property.setAddress(requestDto.getAddress());
		property.setLatitude(latitude);
		property.setLongitude(longitude);

		// 기존 파일 삭제하고
		property.getPropertyImages().forEach(i -> fileService.deleteFile(i.getFilePath()));
		property.setPropertyImages(new ArrayList<>());
		// 이미지 저장
		if (images != null && !images.isEmpty()) {
			images.forEach(i -> {
				String filePath = fileService.saveFile(i);
				PropertyImage propertyImage = PropertyImage.builder()
					.filePath(filePath)
					.build();
				property.addPropertyImage(propertyImage);
			});
		}

		propertyService.updateProperty(property);
	}

	@Override
	public List<PropertyGetResponseDto> getPropertiesByDongcode(String dongcode) {

		List<Property> properties = propertyService.getPropertiesByDongcode(dongcode);

		return properties.stream()
			.map(PropertyMapper::toDto)
			.collect(Collectors.toList());
	}

	@Override
	public List<String> getSidoList() {
		return dongcodesService.getSidoName();
	}

	@Override
	public List<String> getGugunList(String sidoName) {
		return dongcodesService.getGugunName(sidoName);
	}

	@Override
	public List<DongResponseDto> getDongList(String sidoName, String gugunName) {

		return dongcodesService.getDongList(sidoName, gugunName);
	}

	@Override
	@Transactional
	public void deleteProperty(Integer propertyId) {
		// 삭제할 Property 조회
		Property property = propertyService.getProperty(propertyId);

		Integer currentUserId = securityService.getCurrentUser().getUserId();

		// 매물 소유자와 현재 사용자가 다르면 예외 발생
		if (!property.getUser().getId().equals(currentUserId)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}

		// 이미지 파일의 경로들을 미리 저장 (DB 삭제 후 파일 시스템에서 삭제하기 위함)
		List<String> filePaths = property.getPropertyImages().stream()
			.map(PropertyImage::getFilePath)
			.toList();

		// DB 상의 연관 LiveProperty 삭제
		livePropertyService.deleteLivePropertyByPropertyId(propertyId);
		// DB 상의 Property 삭제
		propertyService.deleteProperty(propertyId);

		// DB 삭제 후 파일 시스템 상의 이미지 파일 삭제
		filePaths.forEach(fileService::deleteFile);
	}

	@Override
	public List<PropertySearchGetResponseDto> searchBy(PropertySearchGetRequestDto request) {
		return propertyService.searchBy(request.getKeyword(),
				request.getSidoName(),
				request.getGugunName(),
				request.getDongName(),
				request.getMaxDeposit(),
				request.getMaxMonthlyRent(),
				request.getOptionIds(),
				request.toPageableWithCriteria("created_at")) // elasticsearch 컬럼명으로 넣어줘야함
			.stream().map(p -> PropertySearchGetResponseDto.builder()
				.area(p.getArea())
				.propertyId(p.getPropertyId())
				.approvalDate(p.getApprovalDate()) // LocalDate 변환
				.monthlyRent(p.getMonthlyRent())
				.deposit(p.getDeposit())
				.currentFloor(p.getCurrentFloor())
				.totalFloors(p.getTotalFloors())
				.address(p.getAddress())
				.dongCode(p.getDongCode())
				.sidoName(p.getSidoName())
				.gugunName(p.getGugunName())
				.dongName(p.getDongName())
				.latitude(p.getLatitude())
				.longitude(p.getLongitude())
				.images(p.getImageUrls())
				.createdAt(p.getCreatedAt())
				.updatedAt(p.getUpdatedAt())
				.options(p.getOptionIds())
				.build()
			)
			.toList();
	}
}


