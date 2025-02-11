package com.ssafy.igeolu.domain.user.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.file.service.FileService;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.RealtorRepository;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.global.util.CoordinateConverter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final RealtorRepository realtorRepository;
	private final FileService fileService;
	private final DongcodesService dongcodesService;

	@Value("${file.base-url}")
	private String baseUrl;

	@Override
	public User getUserById(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}

	@Override
	public void saveRealtorInfo(Realtor realtor) {
		realtorRepository.save(realtor);
	}

	public Realtor createNewRealtorInfo(String title,
		String content,
		String registrationNumber,
		String tel,
		String address,
		String y,
		String x,
		User member,
		Dongcodes dongcodes) {

		// 좌표 변환
		double[] latLon = CoordinateConverter.convertToLatLon(
			Double.parseDouble(x),
			Double.parseDouble(y)
		);

		// 타입 변환
		BigDecimal latitude = BigDecimal.valueOf(latLon[0]);
		BigDecimal longitude = BigDecimal.valueOf(latLon[1]);

		Realtor realtor = Realtor.builder()
			.title(title)
			.content(content)
			.registrationNumber(registrationNumber)
			.tel(tel)
			.address(address)
			.latitude(latitude)
			.longitude(longitude)
			.member(member)
			.dongcodes(dongcodes)
			.build();

		return realtorRepository.save(realtor);
	}

	@Override
	public UserInfoGetResponseDto getUserInfo(Integer userId) {
		User user = getUserById(userId);

		return UserInfoGetResponseDto.builder()
			.userId(user.getId())
			.username(user.getUsername())
			.role(user.getRole())
			.imageUrl(user.getProfileFilePath() == null || user.getProfileFilePath().isEmpty()
				? getDefaultProfilePath(user.getRole())
				: user.getProfileFilePath())
			.build();
	}

	private String getDefaultProfilePath(Role role) {
		if (role == Role.ROLE_MEMBER) {
			return baseUrl + "/member.jpg";
		}
		if (role == Role.ROLE_REALTOR) {
			return baseUrl + "/realtor.jpg";
		}
		return null;
	}

	@Override
	public Realtor getRealtor(User user) {
		return realtorRepository.findByMember(user)
			.orElseThrow(() -> new CustomException(ErrorCode.REALTOR_NOT_FOUND));
	}

	// @Override
	// public RealtorInfoGetResponseDto getRealtorInfo(Integer userId) {
	// 	User user = userRepository.findById(userId)
	// 		.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	//
	// 	Realtor realtor = realtorRepository.findByMember(user)
	// 		.orElseThrow(() -> new CustomException(ErrorCode.REALTOR_NOT_FOUND));
	//
	// 	return mapToRealtorInfoDto(user, realtor);
	// }

	private RealtorInfoGetResponseDto mapToRealtorInfoDto(User user, Realtor realtor) {
		return RealtorInfoGetResponseDto.builder()
			.userId(user.getId())
			.username(user.getUsername())
			.profileImage(user.getProfileFilePath())
			.title(realtor.getTitle())
			.content(realtor.getContent())
			.registrationNumber(realtor.getRegistrationNumber())
			.tel(realtor.getTel())
			.address(realtor.getAddress())
			.latitude(realtor.getLatitude())
			.longitude(realtor.getLongitude())
			.liveCount(realtor.getLiveCount())
			.dongCode(realtor.getDongcodes().getDongCode())
			.build();
	}

	public void updateUserProfileImage(User user, MultipartFile file) {
		String newImageUrl = fileService.saveFile(file);

		if (user.getProfileFilePath() != null && !user.getProfileFilePath().startsWith("/igeolu/")) {
			fileService.deleteFile(user.getProfileFilePath());
		}

		user.setProfileFilePath(newImageUrl);
	}

	@Override
	@Transactional
	public void updateRealtorInfo(User user, RealtorInfoUpdateRequestDto requestDto) {
		Realtor realtor = realtorRepository.findByMember(user)
			.orElseThrow(() -> new CustomException(ErrorCode.REALTOR_NOT_FOUND));

		Dongcodes dongcodes = dongcodesService.getDongcodes(requestDto.getDongcode());

		realtor.update(
			requestDto.getTitle(),
			requestDto.getContent(),
			requestDto.getRegistrationNumber(),
			requestDto.getTel(),
			requestDto.getAddress(),
			requestDto.getY(),
			requestDto.getX(),
			dongcodes
		);
	}

	@Override
	public List<Realtor> getDongRealtorList(String dongcode) {
		return realtorRepository.findByDongcode(dongcode);
	}

	@Override
	public List<Realtor> getRealtorList() {
		return realtorRepository.findAll();
	}
}
