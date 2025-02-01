package com.ssafy.igeolu.domain.user.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow();
	}
}
