package com.ssafy.igeolu.domain.user.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;

public interface UserService {

	User getUserById(Integer id);

	UserInfoGetResponseDto getUserInfo(Integer userId);

	void updateUserProfileImage(User user, MultipartFile file);

	void deleteUserProfileImage(User user);

	void saveRealtorInfo(Realtor realtor);

	Realtor createNewRealtorInfo(String title,
		String content,
		String registrationNumber,
		String tel,
		String address,
		String y,
		String x,
		User member,
		Dongcodes dongcodes);

	String getDefaultProfilePath(Role role);

	Realtor getRealtor(User user);

	// RealtorInfoGetResponseDto getRealtorInfo(Integer userId);

	void updateRealtorInfo(User user, RealtorInfoUpdateRequestDto requestDto);

	List<Realtor> getDongRealtorList(String dongcode);

	List<Realtor> getRealtorList();

}
