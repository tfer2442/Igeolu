package com.ssafy.igeolu.domain.dongcodes.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Dongcodes {
	@Id
	private String dongCode;

	private String sidoName;

	private String gugunName;

	private String dongName;

}
