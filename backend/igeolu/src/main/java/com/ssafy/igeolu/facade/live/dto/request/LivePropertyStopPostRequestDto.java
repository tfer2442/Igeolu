package com.ssafy.igeolu.facade.live.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LivePropertyStopPostRequestDto {
	@Schema(description = "세션 id")
	private String sessionId;

	@Schema(description = "녹화 id")
	private String recordingId;

	@Schema(description = "라이브매물 id")
	private Integer livePropertyId;
}
