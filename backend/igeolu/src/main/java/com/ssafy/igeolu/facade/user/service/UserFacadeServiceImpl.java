package com.ssafy.igeolu.facade.user.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.global.util.CoordinateConverter;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
	private final SecurityService securityService;
	private final UserService userService;
	private final DongcodesService dongcodesService;

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
	public RealtorInfoGetResponseDto getRealtorInfo(Integer userId) {
		return userService.getRealtorInfo(userId);
	}

	@Override
	public void updateRealtorInfo(RealtorInfoUpdateRequestDto requestDto, Integer userId) {
		User user = userService.getUserById(userId);
		userService.updateRealtorInfo(user, requestDto);
	}
}
