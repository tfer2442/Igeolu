package com.ssafy.igeolu.oauth.service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;

public interface SecurityService {
	MeGetResponseDto getCurrentUser();

	User processOAuth2User(String kakaoId, String nickName, String state);
}
