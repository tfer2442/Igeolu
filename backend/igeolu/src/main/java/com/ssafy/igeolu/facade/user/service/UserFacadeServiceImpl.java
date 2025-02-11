package com.ssafy.igeolu.facade.user.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.rating.repository.RatingAvgDto;
import com.ssafy.igeolu.domain.rating.service.RatingService;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.mapper.UserMapper;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
	private final SecurityService securityService;
	private final UserService userService;
	private final DongcodesService dongcodesService;
	private final RatingService ratingService;

	@Override
	@Transactional
	public MeGetResponseDto getMe() {
		Integer currentUserId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(currentUserId);

		return MeGetResponseDto.builder()
			.userId(user.getId())
			.role(user.getRole().name())
			.userName(user.getUsername())
			.build();
	}

	@Override
	@Transactional(readOnly = true)
	public UserInfoGetResponseDto getUserInfo(Integer userId) {
		return userService.getUserInfo(userId);
	}

	@Transactional
	@Override
	public User addInfo(RealtorInfoPostRequestDto request) {
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		if (!user.getRole().equals(Role.ROLE_INCOMPLETE_REALTOR)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}

		Dongcodes dongcodes = dongcodesService.getDongcodes(request.getDongcode());

		Realtor newRealtor = userService.createNewRealtorInfo(
			request.getTitle(),
			request.getContent(),
			request.getRegistrationNumber(),
			request.getTel(),
			request.getAddress(),
			request.getY(),
			request.getX(),
			user,
			dongcodes
		);

		// 기존 토큰 로그아웃, 토큰 (REALTOR)로 재발급 필요 -> 논의 필요
		user.changeRole(Role.ROLE_REALTOR);

		userService.saveRealtorInfo(newRealtor);
		return user;
	}

	@Override
	@Transactional(readOnly = true)
	public RealtorInfoGetResponseDto getRealtorInfo(Integer userId) {
		return userService.getRealtorInfo(userId);
	}

	@Override
	@Transactional
	public void updateRealtorInfo(RealtorInfoUpdateRequestDto requestDto, Integer userId) {
		User user = userService.getUserById(userId);
		userService.updateRealtorInfo(user, requestDto);
	}

	@Override
	@Transactional(readOnly = true)
	public List<RealtorInfoGetResponseDto> getDongRealtorList(String dongcode) {
		// 1. 동에 해당하는 공인중개사 리스트 조회
		List<Realtor> realtors = userService.getDongRealtorList(dongcode);

		// 2. 공인중개사 별로 member의 id 리스트 추출 (userId)
		List<Integer> userIds = realtors.stream()
			.map(realtor -> realtor.getMember().getId())
			.toList();

		// 3. 해당 id들로 평점 평균 조회
		List<RatingAvgDto> ratingAvgs = ratingService.getAverageScoreByRealtorIds(userIds);

		// 4. 결과를 Map으로 변환 (key: userId, value: 평균 평점)
		Map<Integer, Double> ratingAvgMap = ratingAvgs.stream()
			.collect(Collectors.toMap(RatingAvgDto::getUserId, RatingAvgDto::getAverageScore));

		// 5. Realtor -> DTO 변환 시 평점 평균 정보 세팅
		return realtors.stream()
			.map(realtor -> {
				RealtorInfoGetResponseDto dto = UserMapper.toDto(realtor);
				dto.setRatingAvg(ratingAvgMap.getOrDefault(realtor.getMember().getId(), 0.0));
				return dto;
			})
			.sorted(Comparator.comparing(RealtorInfoGetResponseDto::getRatingAvg).reversed())
			.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<RealtorInfoGetResponseDto> getRealtorList() {
		// 1. 공인중개사 전체 리스트 조회
		List<Realtor> realtors = userService.getRealtorList();

		// 2. 공인중개사 별로 member의 id 리스트 추출 (userId)
		List<Integer> userIds = realtors.stream()
			.map(realtor -> realtor.getMember().getId())
			.toList();

		// 3. 해당 id들로 평점 평균 조회
		List<RatingAvgDto> ratingAvgs = ratingService.getAverageScoreByRealtorIds(userIds);

		// 4. 결과를 Map으로 변환 (key: userId, value: 평균 평점)
		Map<Integer, Double> ratingAvgMap = ratingAvgs.stream()
			.collect(Collectors.toMap(RatingAvgDto::getUserId, RatingAvgDto::getAverageScore));

		// 5. Realtor -> DTO 변환 시 평점 평균 정보 세팅
		return realtors.stream()
			.map(realtor -> {
				RealtorInfoGetResponseDto dto = UserMapper.toDto(realtor);
				dto.setRatingAvg(ratingAvgMap.getOrDefault(realtor.getMember().getId(), 0.0));
				return dto;
			})
			.sorted(Comparator.comparing(RealtorInfoGetResponseDto::getRatingAvg).reversed())
			.toList();
	}
}
