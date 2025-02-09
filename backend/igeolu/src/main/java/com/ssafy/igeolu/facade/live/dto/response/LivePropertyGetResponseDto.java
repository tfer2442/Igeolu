package com.ssafy.igeolu.facade.live.dto.response;

import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class LivePropertyGetResponseDto extends PropertyGetResponseDto {
	private Integer livePropertyId;
	private String recordingId;

	public static LivePropertyGetResponseDto from(PropertyGetResponseDto baseDto, Integer livePropertyId,
		String recordingId) {
		return LivePropertyGetResponseDto.builder()
			.propertyId(baseDto.getPropertyId())
			.description(baseDto.getDescription())
			.deposit(baseDto.getDeposit())
			.monthlyRent(baseDto.getMonthlyRent())
			.area(baseDto.getArea())
			.approvalDate(baseDto.getApprovalDate())
			.currentFloor(baseDto.getCurrentFloor())
			.totalFloors(baseDto.getTotalFloors())
			.address(baseDto.getAddress())
			.dongcode(baseDto.getDongcode())
			.latitude(baseDto.getLatitude())
			.longitude(baseDto.getLongitude())
			.options(baseDto.getOptions())
			.images(baseDto.getImages())
			.userId(baseDto.getUserId())
			.livePropertyId(livePropertyId)
			.recordingId(recordingId)
			.build();
	}
}
