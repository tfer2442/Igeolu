package com.ssafy.igeolu.domain.dongcodes.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.repository.DongcodesRepository;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DongcodesServiceImpl implements DongcodesService {

	private final DongcodesRepository dongcodesRepository;


	@Override
	public Dongcodes getDongcodes (String dongCode) {
		return dongcodesRepository.findById(dongCode)
			.orElseThrow(() -> new CustomException(ErrorCode.DONGCODE_NOT_FOUND));
	}

	@Override
	public List<String> getSidoName () {
		return dongcodesRepository.findDistinctSidoName();
	}

	@Override
	public List<String> getGugunName (String sidoName) {
		return dongcodesRepository.findDistinctGugunName(sidoName);
	}

	@Override
	public List<DongResponseDto> getDongList (String sidoName, String gugunName) {
		return dongcodesRepository.findDistinctDongName(sidoName, gugunName);
	}

}
