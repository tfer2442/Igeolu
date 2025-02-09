package com.ssafy.igeolu.domain.user.service;

import com.ssafy.igeolu.domain.user.entity.RealtorInfo;
import com.ssafy.igeolu.domain.user.entity.User;

public interface UserService {

	User getUserById(Integer id);

	void saveRealtorInfo(RealtorInfo realtorInfo);
}
