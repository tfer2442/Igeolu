package com.ssafy.igeolu.facade.live.service;

import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.StartLivePostResponseDto;

public interface LiveFacadeService {
	StartLivePostResponseDto startLive(StartLivePostRequestDto requestDto);
}
