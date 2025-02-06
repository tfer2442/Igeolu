package com.ssafy.igeolu.oauth.service;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;

public interface SecurityService {
	MeGetResponseDto getCurrentUser();
}
