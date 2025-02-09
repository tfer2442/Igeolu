package com.ssafy.igeolu.domain.user.service;

import java.math.BigDecimal;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.repositoy.RealtorRepository;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.repositoy.UserRepository;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final RealtorRepository realtorRepository;

	@Override
	public User getUserById(Integer id) {
		return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}

	@Override
	public void saveRealtorInfo(Realtor realtor) {
		realtorRepository.save(realtor);
	}

	public Realtor createNewRealtorInfo(String title,
		String content,
		String registrationNumber,
		String tel,
		String address,
		BigDecimal latitude,
		BigDecimal longitude,
		User member,
		Dongcodes dongcodes) {

		Realtor realtor = Realtor.builder()
			.title(title)
			.content(content)
			.registrationNumber(registrationNumber)
			.tel(tel)
			.address(address)
			.latitude(latitude)
			.longitude(longitude)
			.liveCount(0)
			.member(member)
			.dongcodes(dongcodes)
			.build();

		return realtorRepository.save(realtor);
	}
}




