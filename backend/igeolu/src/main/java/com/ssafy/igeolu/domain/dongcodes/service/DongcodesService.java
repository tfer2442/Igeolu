package com.ssafy.igeolu.domain.dongcodes.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.entity.EsSigungu;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;

public interface DongcodesService {

	// 동코드 조회?
	Dongcodes getDongcodes(String dongCode);

	List<String> getSidoName();

	List<String> getGugunName(String sidoName);

	List<DongResponseDto> getDongList(String sidoName, String gugunName);

	List<EsSigungu> searchSigungu(String keyword, Pageable pageable);
}
