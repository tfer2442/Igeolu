package com.ssafy.igeolu.facade.property.dto.response;

import com.ssafy.igeolu.domain.option.entity.Option;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OptionListGetResponseDto {
	private Integer OptionId;
	private String OptionName;
}
