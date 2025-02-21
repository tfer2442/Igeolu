package com.ssafy.igeolu.domain.user.repositoy;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.User;

public interface RealtorRepository extends JpaRepository<Realtor, Integer> {
	Optional<Realtor> findByMember(User member);

	@Query("SELECT p FROM Realtor p WHERE p.dongcodes.dongCode = :dongcode")
	List<Realtor> findByDongcode(
		@Param("dongcode") String dongcode
	);
}
