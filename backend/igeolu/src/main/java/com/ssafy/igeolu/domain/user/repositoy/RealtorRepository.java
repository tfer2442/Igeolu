package com.ssafy.igeolu.domain.user.repositoy;

import java.util.Optional;

import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RealtorRepository extends JpaRepository<Realtor, Integer> {
	Optional<Realtor> findByMember(User member);
}
