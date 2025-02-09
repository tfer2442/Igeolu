package com.ssafy.igeolu.facade.live.mapper;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.facade.live.dto.response.LivePropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.mapper.PropertyMapper;

public class LivePropertyMapper {
	/**
	 * Property 엔티티를 LivePropertyGetResponseDto로 변환합니다.
	 * 추가 값은 매개변수 additionalValue로 전달합니다.
	 */
	public static LivePropertyGetResponseDto toDto(Property property, Integer livePropertyId, String recordingId) {
		// 기존 PropertyMapper를 재사용하여 기본 DTO를 생성
		PropertyGetResponseDto baseDto = PropertyMapper.toDto(property);
		// 기본 DTO를 기반으로 추가 컬럼을 넣어 Live DTO 생성
		return LivePropertyGetResponseDto.from(baseDto, livePropertyId, recordingId);
	}
}
