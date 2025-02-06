package com.ssafy.igeolu.facade.live.service;

import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;

public interface LiveFacadeService {
	LivePostResponseDto startLive(StartLivePostRequestDto requestDto);
}
