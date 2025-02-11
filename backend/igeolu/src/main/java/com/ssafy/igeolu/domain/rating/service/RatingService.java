package com.ssafy.igeolu.domain.rating.service;

import java.util.List;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.rating.repository.RatingAvgDto;
import com.ssafy.igeolu.domain.user.entity.User;

public interface RatingService {
	void registerRating(Rating rating);

	boolean existsByLiveSessionAndMember(LiveSession liveSession, User member);

	List<RatingAvgDto> getAverageScoreByRealtorIds(List<Integer> userIds);
}
