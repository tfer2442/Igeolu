package com.ssafy.igeolu.domain.rating.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
	boolean existsByLiveSessionAndMember(LiveSession liveSession, User member);

	Optional<Rating> findByLiveSessionAndMember(LiveSession liveSession, User customer);
}
