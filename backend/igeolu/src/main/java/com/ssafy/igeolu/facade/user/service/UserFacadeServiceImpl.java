package com.ssafy.igeolu.facade.user.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
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
	@Value("${file.base-url}")
	private String baseUrl;

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
	@Transactional
	public void updateRealtorInfo(RealtorInfoUpdateRequestDto requestDto, Integer userId) {
		User user = userService.getUserById(userId);
		userService.updateRealtorInfo(user, requestDto);
	}

	@Override
	@Transactional(readOnly = true)
	public List<RealtorInfoGetResponseDto> getDongRealtorList(String dongcode) {
		// 동에 해당하는 공인중개사 리스트 조회
		List<Realtor> realtors = userService.getDongRealtorList(dongcode);
		return convertToDtoWithRating(realtors);
	}

	@Override
	@Transactional(readOnly = true)
	public List<RealtorInfoGetResponseDto> getRealtorList() {
		// 전체 공인중개사 리스트 조회
		List<Realtor> realtors = userService.getRealtorList();
		return convertToDtoWithRating(realtors);
	}

	@Transactional(readOnly = true)
	@Override
	public RealtorInfoGetResponseDto getRealtorDetail(Integer realtorId) {
		// 1. realtorId로 공인중개사 엔티티 조회 (userService 혹은 repository를 이용)
		User realtor = userService.getUserById(realtorId);
		Realtor realtorInfo = userService.getRealtor(realtor);

		// 2. 회원의 ID를 이용하여 평점 평균 조회
		// ratingService.getAverageScoreByRealtorIds()는 리스트를 인자로 받으므로, 단일 조회를 위해 단일 요소 리스트로 감싸서 호출
		List<RatingAvgDto> ratingAvgs = ratingService.getAverageScoreByRealtorIds(List.of(realtor.getId()));
		Double ratingAvg = ratingAvgs.isEmpty() ? 0.0 : ratingAvgs.get(0).getAverageScore();

		// 3. 조회한 공인중개사 엔티티를 DTO로 변환하고 평점 평균 세팅
		RealtorInfoGetResponseDto dto = UserMapper.toDto(realtorInfo);
		dto.setRatingAvg(ratingAvg);

		// 4. 프로필 이미지가 없거나 빈 문자열이면 기본 경로를 설정
		if (dto.getProfileImage() == null || dto.getProfileImage().trim().isEmpty()) {
			dto.setProfileImage(getDefaultProfilePath(realtor.getRole()));
		}

		return dto;
	}

	/**
	 * 공인중개사 리스트와 평점 평균 정보를 결합하여 DTO 리스트로 변환하는 공통 메서드
	 */
	private List<RealtorInfoGetResponseDto> convertToDtoWithRating(List<Realtor> realtors) {
		// 1. 각 공인중개사에 연결된 회원의 ID 목록 추출
		List<Integer> userIds = realtors.stream()
			.map(realtor -> realtor.getMember().getId())
			.toList();

		// 2. 해당 ID들로 평점 평균 조회
		List<RatingAvgDto> ratingAvgs = ratingService.getAverageScoreByRealtorIds(userIds);

		// 3. 조회된 결과를 Map으로 변환 (key: userId, value: 평균 평점)
		Map<Integer, Double> ratingAvgMap = ratingAvgs.stream()
			.collect(Collectors.toMap(RatingAvgDto::getUserId, RatingAvgDto::getAverageScore));

		// 4. 각 Realtor 엔티티를 DTO로 변환하며 평점 평균 정보 세팅
		return realtors.stream()
			.map(realtor -> {
				RealtorInfoGetResponseDto dto = UserMapper.toDto(realtor);
				dto.setRatingAvg(ratingAvgMap.getOrDefault(realtor.getMember().getId(), 0.0));

				// 프로필 이미지가 비어있으면 기본값으로 채움
				if (dto.getProfileImage() == null || dto.getProfileImage().trim().isEmpty()) {
					dto.setProfileImage(getDefaultProfilePath(realtor.getMember().getRole()));
				}

				return dto;
			})
			.sorted(Comparator.comparing(RealtorInfoGetResponseDto::getRatingAvg).reversed())
			.toList();
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
}
