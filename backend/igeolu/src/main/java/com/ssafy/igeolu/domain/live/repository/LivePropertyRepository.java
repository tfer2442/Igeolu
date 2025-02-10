package com.ssafy.igeolu.domain.live.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;
import com.ssafy.igeolu.domain.live.entity.LiveSession;

@Repository
public interface LivePropertyRepository extends JpaRepository<LiveProperty, Integer> {
	List<LiveProperty> findByLiveSession(LiveSession liveSession);

	@Modifying
	int deleteAllByProperty_Id(Integer propertyId);
}
