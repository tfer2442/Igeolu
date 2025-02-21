package com.ssafy.igeolu.facade.live.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemoPutRequestDto {
	@Schema(description = "메모 내용")
	private String memo;
}
