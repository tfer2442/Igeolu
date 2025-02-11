package com.ssafy.igeolu.facade.rating.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.live.service.LiveSessionService;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.rating.service.RatingService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.rating.dto.request.RatingPostRequestDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.service.SecurityService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingFacadeServiceImpl implements RatingFacadeService {
	private final RatingService ratingService;
	private final LiveSessionService liveSessionService;
	private final SecurityService securityService;
	private final UserService userService;

	@Override
	@Transactional
	public void registerRating(String liveId, RatingPostRequestDto ratingPostRequestDto) {
		// 라이브 세션 존재 여부 검증
		LiveSession liveSession = liveSessionService.getLiveSession(liveId);

		// 현재 고객이 해당 라이브 세션에 참여한 사용자인지 검증 (예: 고객이 맞는지)
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		// 현재 고객이 해당 라이브 세션에 참여한 사용자인지 검증 (예: 고객이 맞는지)
		if (!liveSession.getMember().getId().equals(user.getId())) {
			throw new CustomException(ErrorCode.RATING_BAD_REQUEST);
		}

		// 이미 평점을 남긴 경우 중복 방지
		if (ratingService.existsByLiveSessionAndMember(liveSession, user)) {
			throw new CustomException(ErrorCode.RATING_BAD_REQUEST);
		}

		Rating rating = Rating.builder()
			.liveSession(liveSession)
			.realtor(liveSession.getRealtor())
			.member(user)
			.score(ratingPostRequestDto.getScore())
			.build();

		ratingService.registerRating(rating);
	}
}
