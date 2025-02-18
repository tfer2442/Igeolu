package com.ssafy.igeolu.facade.live.dto.response;

import java.time.LocalDateTime;

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
public class LiveGetResponseDto {
	@Schema(description = "라이브 id")
	private String liveId;

	@Schema(description = "라이브 생성한 공인중개사 id")
	private Integer realtorId;

	@Schema(description = "라이브 생성한 공인중개사 이름")
	private String realtorName;

	@Schema(description = "생성일")
	private LocalDateTime createdAt;
}
