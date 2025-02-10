package com.ssafy.igeolu.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.file.service.FileService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	public final FileService fileService;

	@Override
	public User getUserById(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}

	@Override
	public UserInfoGetResponseDto getUserInfo(Integer userId) {

		User user = getUserById(userId);

		return UserInfoGetResponseDto.builder()
			.userId(user.getId())
			.username(user.getUsername())
			.role(user.getRole())
			.imageUrl(user.getProfileFilePath())
			.build();
	}

	public void updateUserProfileImage(User user, MultipartFile file) {
		String newImageUrl = fileService.saveFile(file);

		if (user.getProfileFilePath() != null && !user.getProfileFilePath().startsWith("/igeolu/")) {
			fileService.deleteFile(user.getProfileFilePath());
		}

		user.setProfileFilePath(newImageUrl);
	}
}




