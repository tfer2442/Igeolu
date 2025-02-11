package com.ssafy.igeolu.domain.user.service;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.user.entity.Realtor;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;

public interface UserService {

	User getUserById(Integer id);

	UserInfoGetResponseDto getUserInfo(Integer userId);

	void updateUserProfileImage(User user, MultipartFile file);

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

	RealtorInfoGetResponseDto getRealtorInfo(Integer userId);

	void updateRealtorInfo(User user, RealtorInfoUpdateRequestDto requestDto);


}
