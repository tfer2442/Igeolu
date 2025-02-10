package com.ssafy.igeolu.facade.user.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
	private final SecurityService securityService;
	private final UserService userService;

	@Override
	public MeGetResponseDto getMe() {
		Integer currentUserId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(currentUserId);

		return MeGetResponseDto.builder()
			.userId(user.getId())
			.role(user.getRole().name())
			.userName(user.getUsername())
			.build();
	}
}
