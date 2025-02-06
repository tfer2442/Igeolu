package com.ssafy.igeolu.facade.user.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
	private final SecurityService securityService;

	@Override
	public MeGetResponseDto getMe() {
		return securityService.getCurrentUser();
	}
}
