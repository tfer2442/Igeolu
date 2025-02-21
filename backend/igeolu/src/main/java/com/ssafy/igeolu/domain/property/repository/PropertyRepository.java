package com.ssafy.igeolu.domain.property.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
	List<Property> findByUser(User user);

	@Query("SELECT p FROM Property p WHERE p.dongcode.dongCode = :dongcode")
	List<Property> findByDongcode(
		@Param("dongcode") String dongcode
	);

}
