package com.ssafy.igeolu.facade.rating.service;

import com.ssafy.igeolu.facade.rating.dto.request.RatingPostRequestDto;

public interface RatingFacadeService {
	void registerRating(String liveId, RatingPostRequestDto ratingPostRequestDto);
}
