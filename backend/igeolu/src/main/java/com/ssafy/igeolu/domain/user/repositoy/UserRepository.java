package com.ssafy.igeolu.domain.user.repositoy;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.igeolu.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findById(Integer id);
}
