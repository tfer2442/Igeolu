package com.ssafy.igeolu.facade.example.dto.response;

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
public class ExampleGetResponseDto {
	@Schema(description = "예제 id")
	private Integer exampleId;

	@Schema(description = "예제 이름")
	private String exampleName;
}
