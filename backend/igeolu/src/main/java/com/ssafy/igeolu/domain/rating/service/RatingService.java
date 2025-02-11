package com.ssafy.igeolu.domain.rating.service;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.user.entity.User;

public interface RatingService {
	void registerRating(Rating rating);

	boolean existsByLiveSessionAndMember(LiveSession liveSession, User member);
}
