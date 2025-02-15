package com.ssafy.igeolu.domain.dongcodes.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
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
	List<DongResponseDto> findDistinctDongName(@Param("sidoName") String sidoName,
		@Param("gugunName") String gugunName);

	List<Dongcodes> findByDongCodeContainingOrSidoNameContainingOrGugunNameContainingOrDongNameContaining(
		String dongCode, String sidoName, String gugunName, String dongName, Pageable pageable);

	// 부하 테스트용 메서드
	@Query(value = "SELECT d.*, " +
		"  ( " +
		// dong_name에 대한 점수 계산
		"    CASE WHEN d.dong_name = :keyword THEN 100 ELSE 0 END + " +
		"    CASE WHEN d.dong_name LIKE CONCAT(:keyword, '%') THEN 50 ELSE 0 END + " +
		"    CASE WHEN d.dong_name LIKE CONCAT('%', :keyword, '%') THEN 20 ELSE 0 END + " +
		"    CASE WHEN d.dong_name LIKE CONCAT('%', :token1, '%') THEN 10 ELSE 0 END + " +
		"    CASE WHEN d.dong_name LIKE CONCAT('%', :token2, '%') THEN 10 ELSE 0 END + " +
		// sido_name에 대한 점수 계산
		"    CASE WHEN d.sido_name = :keyword THEN 80 ELSE 0 END + " +
		"    CASE WHEN d.sido_name LIKE CONCAT(:keyword, '%') THEN 40 ELSE 0 END + " +
		"    CASE WHEN d.sido_name LIKE CONCAT('%', :keyword, '%') THEN 15 ELSE 0 END + " +
		"    CASE WHEN d.sido_name LIKE CONCAT('%', :token1, '%') THEN 5 ELSE 0 END + " +
		"    CASE WHEN d.sido_name LIKE CONCAT('%', :token2, '%') THEN 5 ELSE 0 END + " +
		// gugun_name에 대한 점수 계산
		"    CASE WHEN d.gugun_name = :keyword THEN 80 ELSE 0 END + " +
		"    CASE WHEN d.gugun_name LIKE CONCAT(:keyword, '%') THEN 40 ELSE 0 END + " +
		"    CASE WHEN d.gugun_name LIKE CONCAT('%', :keyword, '%') THEN 15 ELSE 0 END + " +
		"    CASE WHEN d.gugun_name LIKE CONCAT('%', :token1, '%') THEN 5 ELSE 0 END + " +
		"    CASE WHEN d.gugun_name LIKE CONCAT('%', :token2, '%') THEN 5 ELSE 0 END + " +
		// dong_code에 대한 점수 계산
		"    CASE WHEN d.dong_code = :keyword THEN 60 ELSE 0 END + " +
		"    CASE WHEN d.dong_code LIKE CONCAT(:keyword, '%') THEN 30 ELSE 0 END + " +
		"    CASE WHEN d.dong_code LIKE CONCAT('%', :keyword, '%') THEN 10 ELSE 0 END " +
		"  ) AS score " +
		"FROM dongcodes d " +
		"WHERE d.dong_name LIKE CONCAT('%', :keyword, '%') " +
		"   OR d.sido_name LIKE CONCAT('%', :keyword, '%') " +
		"   OR d.gugun_name LIKE CONCAT('%', :keyword, '%') " +
		"   OR d.dong_code LIKE CONCAT('%', :keyword, '%') " +
		"ORDER BY score DESC",
		countQuery = "SELECT count(*) FROM dongcodes d " +
			"WHERE d.dong_name LIKE CONCAT('%', :keyword, '%') " +
			"   OR d.sido_name LIKE CONCAT('%', :keyword, '%') " +
			"   OR d.gugun_name LIKE CONCAT('%', :keyword, '%') " +
			"   OR d.dong_code LIKE CONCAT('%', :keyword, '%')",
		nativeQuery = true)
	List<Dongcodes> searchByMultiColumnsSimilar(@Param("keyword") String keyword,
		@Param("token1") String token1,
		@Param("token2") String token2,
		Pageable pageable);
}
