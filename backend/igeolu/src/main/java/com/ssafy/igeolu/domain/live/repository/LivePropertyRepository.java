package com.ssafy.igeolu.domain.live.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;

@Repository
public interface LivePropertyRepository extends JpaRepository<LiveProperty, Integer> {
}
