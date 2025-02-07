package com.ssafy.igeolu.facade.property.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class PropertySearchGetResponseDto {

	private BigDecimal area;

	private LocalDate approvalDate;

	private Integer currentFloor;

	private Integer totalFloors;

	private String address;

	private String sidoName;

	private String gugunName;

	private String dongName;

	private BigDecimal latitude;  // y

	private BigDecimal longitude; // x

	private List<String> images;
}
