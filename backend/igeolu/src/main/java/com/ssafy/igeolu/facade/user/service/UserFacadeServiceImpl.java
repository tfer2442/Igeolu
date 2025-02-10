package com.ssafy.igeolu.facade.user.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
	private final SecurityService securityService;
	private final UserService userService;
	private final UserRepository userRepository;

	@Override
	public MeGetResponseDto getMe() {
		return securityService.getCurrentUser();
	}

	@Override
	public UserInfoGetResponseDto getUserInfo(Integer userId) {
		return userService.getUserInfo(userId);
	}
}
