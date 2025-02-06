package com.ssafy.igeolu.domain.dongcodes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;

@Repository
public interface DongcodesRepository extends JpaRepository<Dongcodes, String> {

	@Query("SELECT DISTINCT d.sidoName FROM Dongcodes d")
	List<String> findDistinctSidoName();

	@Query("SELECT DISTINCT d.gugunName FROM Dongcodes d WHERE d.sidoName = :sidoName" + " AND d.gugunName IS NOT NULL")
	List<String> findDistinctGugunName(@Param("sidoName") String sidoName);

	@Query("SELECT new com.ssafy.igeolu.facade.property.dto.response.DongResponseDto(d.dongCode, d.dongName) " +
		"FROM Dongcodes d " +
		"WHERE d.sidoName = :sidoName " +
		"AND d.gugunName = :gugunName " +
		"AND d.dongName IS NOT NULL")
	List<DongResponseDto> findDistinctDongName(@Param("sidoName") String sidoName, @Param("gugunName") String gugunName);
}
