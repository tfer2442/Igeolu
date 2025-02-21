package com.ssafy.igeolu.facade.live.dto.response;

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
public class LivePostResponseDto {
	@Schema(description = "세션 id")
	private String sessionId;

	@Schema(description = "토큰")
	private String token;
}
