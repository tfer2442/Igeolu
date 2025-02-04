package com.ssafy.igeolu.domain.property.service;

import java.util.List;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.user.entity.User;

public interface PropertyService {

	// 뭐 드갈지 몰라서 () 안에 안넣음.
	// 매물 등록
	void createProperty(Property property);

	List<Property> getPropertyList(User user);
}
