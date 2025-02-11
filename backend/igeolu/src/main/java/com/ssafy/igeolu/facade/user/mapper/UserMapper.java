package com.ssafy.igeolu.facade.user.mapper;

import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;

public class UserMapper {
	// Realtor → RealtorInfoGetResponseDto 변환
	public static RealtorInfoGetResponseDto toDto(Realtor realtor) {
		if (realtor == null) {
			return null;
		}

		return RealtorInfoGetResponseDto.builder()
			.userId(realtor.getMember().getId())
			.username(realtor.getMember().getUsername())
			.profileImage(realtor.getMember().getProfileFilePath())
			.title(realtor.getTitle())
			.content(realtor.getContent())
			.registrationNumber(realtor.getRegistrationNumber())
			.tel(realtor.getTel())
			.address(realtor.getAddress())
			.latitude(realtor.getLatitude())
			.longitude(realtor.getLongitude())
			.liveCount(realtor.getLiveCount())
			.dongCode(realtor.getDongcodes().getDongCode())
			.build();
	}
}
