package com.ssafy.igeolu.facade.property.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class DongcodesSearchGetResponseDto {
	private String dongCode;
	private String sidoName;
	private String gugunName;
	private String dongName;
}
