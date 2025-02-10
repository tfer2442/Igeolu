package com.ssafy.igeolu.facade.live.service;

import java.util.List;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStartPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStopPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.MemoPutRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LiveGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePropertyGetResponseDto;

import io.openvidu.java.client.Recording;

public interface LiveFacadeService {
	LivePostResponseDto startLive(StartLivePostRequestDto requestDto);

	LivePostResponseDto joinLive(JoinLivePostRequestDto requestDto);

	List<LiveGetResponseDto> getLives();

	List<LivePropertyGetResponseDto> getProperties(String liveId);

	Recording startLiveProperty(Integer livePropertyId, LivePropertyStartPostRequestDto requestDto);

	void stopLiveProperty(Integer livePropertyId, LivePropertyStopPostRequestDto requestDto);

	Recording getRecording(String recordingId);

	void editMemo(Integer livePropertyId, MemoPutRequestDto memoPutRequestDto);
}
