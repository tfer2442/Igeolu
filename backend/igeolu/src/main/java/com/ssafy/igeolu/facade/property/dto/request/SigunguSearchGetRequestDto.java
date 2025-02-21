package com.ssafy.igeolu.facade.property.dto.request;

import com.ssafy.igeolu.global.config.CommonPageRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class SigunguSearchGetRequestDto extends CommonPageRequest {
	private String keyword;
}
