package com.ssafy.igeolu.domain.live.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface LiveSessionRepository extends JpaRepository<LiveSession, String> {

	List<LiveSession> findLiveSessionByMember(User member);

	List<LiveSession> findLiveSessionByRealtor(User realtor);
}
