package com.ssafy.igeolu.facade.user.service;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;

public interface UserFacadeService {
	MeGetResponseDto getMe();

	UserInfoGetResponseDto getUserInfo(Integer userId);
}
