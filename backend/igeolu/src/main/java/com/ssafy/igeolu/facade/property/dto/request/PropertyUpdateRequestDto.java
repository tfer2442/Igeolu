package com.ssafy.igeolu.facade.property.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PropertyUpdateRequestDto {

	private String description;

	private Integer deposit;

	private Integer monthlyRent;

	private BigDecimal area;

	private LocalDate approvalDate;

	private Integer currentFloor;

	private Integer totalFloors;

	private String address;

	// latitude
	private String y;

	// longitude
	private String x;

	// private String dongcode;

	private List<Integer> options;

}
