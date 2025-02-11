package com.ssafy.igeolu.facade.user.service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;

public interface UserFacadeService {
	MeGetResponseDto getMe();

	RealtorInfoGetResponseDto getRealtorInfo(Integer userId);

	User addInfo(RealtorInfoPostRequestDto request);

	UserInfoGetResponseDto getUserInfo(Integer userId);

	void updateRealtorInfo(RealtorInfoUpdateRequestDto requestDto, Integer userId);
}
