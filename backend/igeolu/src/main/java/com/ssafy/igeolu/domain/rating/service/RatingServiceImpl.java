package com.ssafy.igeolu.domain.rating.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.rating.repository.RatingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
	private final RatingRepository ratingRepository;

	@Override
	public void registerRating(Rating rating) {
		ratingRepository.save(rating);
	}
}
