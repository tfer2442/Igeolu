package com.ssafy.igeolu.facade.property.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PropertyGetResponseDto {

	private Integer propertyId;

	private String description;

	private Integer deposit;

	private Integer monthlyRent;

	private BigDecimal area;

	private LocalDate approvalDate;

	private Integer currentFloor;

	private Integer totalFloors;

	private String address;

	private String dongcode;

	private BigDecimal latitude;  // y

	private BigDecimal longitude; // x

	private List<OptionDto> options;

	private List<String> images;

	@Getter
	@AllArgsConstructor
	public static class OptionDto {
		private Integer optionId;
		private String optionName;
	}

	private Integer userId;

}
