package com.ssafy.igeolu.facade.rating.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RatingEligibilityGetResponseDto {
	@Schema(description = "평점 입력 가능 유저 여부")
	private boolean eligible;
}
