package com.ssafy.igeolu.facade.property.dto.request;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.ssafy.igeolu.global.config.CommonPageRequest;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class DongcodesSearchGetRequestDto extends CommonPageRequest {
	private String keyword;

	// 페이지, 사이즈만 사용하는 경우의 Pageable 생성 메서드
	public Pageable toPageable() {
		return PageRequest.of(getPage(), getSize());
	}
}