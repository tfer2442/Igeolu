package com.ssafy.igeolu.facade.live.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.StartLivePostResponseDto;

import io.openvidu.java.client.OpenVidu;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiveFacadeServiceImpl implements LiveFacadeService {
	private final OpenVidu openVidu;

	@Override
	public StartLivePostResponseDto startLive(StartLivePostRequestDto requestDto) {

		return null;
	}

}
