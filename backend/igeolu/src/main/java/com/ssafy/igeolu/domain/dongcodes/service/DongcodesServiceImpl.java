package com.ssafy.igeolu.domain.dongcodes.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.dongcodes.entity.EsSigungu;
import com.ssafy.igeolu.domain.dongcodes.repository.DongcodesRepository;
import com.ssafy.igeolu.domain.dongcodes.repository.EsSigunguRepository;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.DongcodesSearchGetResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

@Service
public class DongcodesServiceImpl implements DongcodesService {

	private final DongcodesRepository dongcodesRepository;
	private final EsSigunguRepository esSigunguRepository;

	public DongcodesServiceImpl(DongcodesRepository dongcodesRepository,
		@Autowired(required = false) EsSigunguRepository esSigunguRepository) {
		this.dongcodesRepository = dongcodesRepository;
		this.esSigunguRepository = esSigunguRepository;
	}

	@Override
	public Dongcodes getDongcodes(String dongCode) {
		return dongcodesRepository.findById(dongCode)
			.orElseThrow(() -> new CustomException(ErrorCode.DONGCODE_NOT_FOUND));
	}

	@Override
	public List<String> getSidoName() {
		return dongcodesRepository.findDistinctSidoName();
	}

	@Override
	public List<String> getGugunName(String sidoName) {
		return dongcodesRepository.findDistinctGugunName(sidoName);
	}

	@Override
	public List<DongResponseDto> getDongList(String sidoName, String gugunName) {
		return dongcodesRepository.findDistinctDongName(sidoName, gugunName);
	}

	public List<EsSigungu> searchSigungu(String keyword, Pageable pageable) {
		return esSigunguRepository.searchSigungu(keyword, pageable);
	}

	// 부하 테스트용 메서드
	@Override
	public List<DongcodesSearchGetResponseDto> searchDongcodes(String keyword, Pageable pageable) {
		// 키워드가 두 글자 이상이면 첫 두 글자를 토큰으로 사용, 아니면 그대로 사용
		String token1 = keyword;
		String token2 = keyword;
		if (keyword != null && keyword.length() >= 2) {
			token1 = keyword.substring(0, 1);
			token2 = keyword.substring(1, 2);
		}

		List<Dongcodes> result = dongcodesRepository.searchByMultiColumnsSimilar(keyword, token1, token2, pageable);
		return result.stream()
			.map(d -> DongcodesSearchGetResponseDto.builder()
				.dongCode(d.getDongCode())
				.sidoName(d.getSidoName())
				.gugunName(d.getGugunName())
				.dongName(d.getDongName())
				.build())
			.collect(Collectors.toList());
	}
}
