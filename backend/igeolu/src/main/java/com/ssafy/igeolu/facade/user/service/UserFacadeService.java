package com.ssafy.igeolu.facade.user.service;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;

public interface UserFacadeService {
	MeGetResponseDto getMe();

	UserInfoGetResponseDto getUserInfo(Integer userId);
}
