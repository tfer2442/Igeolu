package com.ssafy.igeolu.domain.option.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.option.entity.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {
	List<Option> findByIdIn(List<Integer> ids);
}
