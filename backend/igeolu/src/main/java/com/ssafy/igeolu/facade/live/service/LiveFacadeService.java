package com.ssafy.igeolu.facade.live.service;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;

import jakarta.transaction.Transactional;

public interface LiveFacadeService {
	LivePostResponseDto startLive(StartLivePostRequestDto requestDto);

	@Transactional
	LivePostResponseDto joinLive(JoinLivePostRequestDto requestDto);
}
