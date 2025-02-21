package com.ssafy.igeolu.domain.live.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.live.repository.LiveSessionRepository;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiveSessionServiceImpl implements LiveSessionService {
	private final LiveSessionRepository liveSessionRepository;

	@Override
	public void registerLiveSession(LiveSession liveSession) {
		liveSessionRepository.save(liveSession);
	}

	@Override
	public List<LiveSession> getLiveSessionsByMember(User member) {
		return liveSessionRepository.findLiveSessionByMember(member);
	}

	@Override
	public List<LiveSession> getLiveSessionsByRealtor(User realtor) {
		return liveSessionRepository.findLiveSessionByRealtor(realtor);
	}

	@Override
	public LiveSession getLiveSession(String liveSessionId) {
		return liveSessionRepository.findById(liveSessionId)
			.orElseThrow(() -> new CustomException(ErrorCode.LIVE_SESSION_NOT_FOUND));
	}
}
