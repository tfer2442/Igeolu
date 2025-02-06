package com.ssafy.igeolu.facade.live.service;

import java.util.List;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LiveGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;

public interface LiveFacadeService {
	LivePostResponseDto startLive(StartLivePostRequestDto requestDto);

	LivePostResponseDto joinLive(JoinLivePostRequestDto requestDto);

	List<LiveGetResponseDto> getLives();
}
