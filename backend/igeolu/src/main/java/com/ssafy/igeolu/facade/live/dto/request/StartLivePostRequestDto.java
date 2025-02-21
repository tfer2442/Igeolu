package com.ssafy.igeolu.facade.live.dto.request;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StartLivePostRequestDto {

	@Schema(description = "매물 id 리스트")
	private List<Integer> propertyIds;
}
