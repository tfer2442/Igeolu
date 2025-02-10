package com.ssafy.igeolu.domain.user.service;

import org.springframework.context.annotation.Profile;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;

public interface UserService {

	User getUserById(Integer id);

	UserInfoGetResponseDto getUserInfo(Integer userId);

	void updateUserProfileImage(User user, MultipartFile file);
}
