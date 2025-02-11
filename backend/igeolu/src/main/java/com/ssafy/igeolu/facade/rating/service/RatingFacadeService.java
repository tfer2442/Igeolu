package com.ssafy.igeolu.facade.rating.service;

import com.ssafy.igeolu.facade.rating.dto.request.RatingPostRequestDto;
import com.ssafy.igeolu.facade.rating.dto.response.RatingEligibilityGetResponseDto;

public interface RatingFacadeService {
	void registerRating(String liveId, RatingPostRequestDto ratingPostRequestDto);

	RatingEligibilityGetResponseDto checkRatingEligibility(String liveId);
}
