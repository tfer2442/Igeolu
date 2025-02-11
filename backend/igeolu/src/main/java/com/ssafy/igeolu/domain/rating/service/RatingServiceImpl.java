package com.ssafy.igeolu.domain.rating.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.rating.repository.RatingAvgDto;
import com.ssafy.igeolu.domain.rating.repository.RatingRepository;
import com.ssafy.igeolu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
	private final RatingRepository ratingRepository;

	@Override
	public void registerRating(Rating rating) {
		ratingRepository.save(rating);
	}

	@Override
	public boolean existsByLiveSessionAndMember(LiveSession liveSession, User member) {
		return ratingRepository.existsByLiveSessionAndMember(liveSession, member);
	}

	@Override
	public List<RatingAvgDto> getAverageScoreByRealtorIds(List<Integer> userIds) {
		return ratingRepository.findAverageScoreByRealtorIds(userIds);
	}
}
