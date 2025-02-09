package com.ssafy.igeolu.domain.user.service;

import com.ssafy.igeolu.domain.user.entity.RealtorInfo;
import com.ssafy.igeolu.domain.user.repositoy.RealtorInfoRepository;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final RealtorInfoRepository realtorInfoRepository;

	@Override
	public User getUserById(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}

	@Override
	public void saveRealtorInfo(RealtorInfo realtorInfo) {
		realtorInfoRepository.save(realtorInfo);
	}
}



