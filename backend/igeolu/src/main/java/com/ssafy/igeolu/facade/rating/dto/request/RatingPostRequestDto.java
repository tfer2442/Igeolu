package com.ssafy.igeolu.facade.rating.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RatingPostRequestDto {
	private String liveId;
	private Float score;
}
