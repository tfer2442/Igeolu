package com.ssafy.igeolu.domain.live.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;

@Repository
public interface LivePropertyRepository extends JpaRepository<LiveProperty, Integer> {

	void List<S> saveAll(Iterable<S> entities);
}
