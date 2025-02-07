package com.ssafy.igeolu.domain.property.service;

import java.util.List;

import com.ssafy.igeolu.domain.property.entity.EsProperty;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.user.entity.User;

public interface PropertyService {

	// 뭐 드갈지 몰라서 () 안에 안넣음.
	// 매물 등록
	void createProperty(Property property);

	List<Property> getPropertyList(User user);

	List<Property> getPropertyListIds(List<Integer> propertyIds);

	Property getProperty(Integer propertyId);

	void updateProperty(Property property);

	List<Property> getPropertiesByDongcode(String dongcode);

	List<EsProperty> searchBy(String keyword, String sidoName, String gugunName, String dongName, Integer maxDeposit,
		Integer maxMonthlyRent, List<Integer> optionIds);

}
