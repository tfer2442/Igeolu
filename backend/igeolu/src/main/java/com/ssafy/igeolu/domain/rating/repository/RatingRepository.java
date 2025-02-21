package com.ssafy.igeolu.domain.rating.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.rating.entity.Rating;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
	boolean existsByLiveSessionAndMember(LiveSession liveSession, User member);

	Optional<Rating> findByLiveSessionAndMember(LiveSession liveSession, User customer);

	// 여러 공인중개사의 아이디 리스트로 평점 한 번에 조회 (group by 사용)
	@Query("SELECT r.realtor.id as userId, ROUND(AVG(r.score), 1) as averageScore "
		+ "FROM Rating r "
		+ "WHERE r.realtor.id IN :userIds "
		+ "GROUP BY r.realtor.id")
	List<RatingAvgDto> findAverageScoreByRealtorIds(@Param("userIds") List<Integer> userIds);
}