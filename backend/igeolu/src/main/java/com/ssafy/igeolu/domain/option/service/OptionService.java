package com.ssafy.igeolu.domain.option.service;

import java.util.List;

import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;

public interface OptionService {
	
	// 옵션 조회
	List<Option> getOptionFromPropertyOptions(List<PropertyOption> propertyOptions);

}
