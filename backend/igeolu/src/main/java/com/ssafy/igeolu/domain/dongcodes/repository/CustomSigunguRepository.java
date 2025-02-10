package com.ssafy.igeolu.domain.dongcodes.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.ssafy.igeolu.domain.dongcodes.entity.EsSigungu;

public interface CustomSigunguRepository {
	List<EsSigungu> searchSigungu(String keyword, Pageable pageable);
}
