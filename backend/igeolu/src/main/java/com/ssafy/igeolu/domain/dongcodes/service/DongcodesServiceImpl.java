package com.ssafy.igeolu.domain.dongcodes.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.repository.DongcodesRepository;
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
}
