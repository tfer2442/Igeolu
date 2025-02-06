package com.ssafy.igeolu.domain.live.service;

import java.util.List;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.user.entity.User;

public interface LiveSessionService {

	void registerLiveSession(LiveSession liveSession);

	List<LiveSession> getLiveSessionsByMember(User member);

	List<LiveSession> getLiveSessionsByRealtor(User realtor);
	
	LiveSession getLiveSession(String liveSessionId);
}
