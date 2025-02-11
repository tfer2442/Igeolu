package com.ssafy.igeolu.facade.rating.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RatingPostRequestDto {
	@Schema(description = "라이브 세션 id")
	private String liveId;

	@Schema(description = "점수")
	@DecimalMin(value = "0.0", message = "최소 점수는 0점이어야 합니다.")
	@DecimalMax(value = "5.0", message = "최대 점수는 5점이어야 합니다.")
	@NotNull
	private Float score;
}
