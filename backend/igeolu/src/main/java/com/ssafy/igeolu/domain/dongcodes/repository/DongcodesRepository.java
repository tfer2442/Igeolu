package com.ssafy.igeolu.domain.dongcodes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;

@Repository
public interface DongcodesRepository extends JpaRepository<Dongcodes, String> {
}
