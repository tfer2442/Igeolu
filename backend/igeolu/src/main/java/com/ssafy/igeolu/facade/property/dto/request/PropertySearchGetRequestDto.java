package com.ssafy.igeolu.facade.property.dto.request;

import java.util.List;

import com.ssafy.igeolu.global.config.CommonPageRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class PropertySearchGetRequestDto extends CommonPageRequest {

	// 들어오는 값 종류 : 집주소
	private String keyword;

	private String sidoName;

	private String gugunName;

	private String dongName;

	// 최대 보증금
	private Integer maxDeposit;

	// 최대 월세
	private Integer maxMonthlyRent;

	// 옵션 종류
	private List<Integer> optionIds;
}
