package com.ssafy.igeolu.domain.user.service;

import java.math.BigDecimal;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.User;

public interface UserService {

	User getUserById(Integer id);

	void saveRealtorInfo(Realtor realtor);

	Realtor createNewRealtorInfo(String title,
		String content,
		String registrationNumber,
		String tel,
		String address,
		BigDecimal latitude,
		BigDecimal longitude,
		User member,
		Dongcodes dongcodes);
}
