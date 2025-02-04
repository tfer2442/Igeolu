package com.ssafy.igeolu.facade.property.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ssafy.igeolu.domain.option.entity.Option;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
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

	private List<Option> options;

}
