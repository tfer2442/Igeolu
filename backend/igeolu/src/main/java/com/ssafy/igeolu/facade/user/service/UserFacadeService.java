package com.ssafy.igeolu.facade.user.service;

import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;

public interface UserFacadeService {
	MeGetResponseDto getMe();

  void addInfo(RealtorInfoPostRequestDto request);
}
