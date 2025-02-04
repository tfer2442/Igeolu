package com.ssafy.igeolu.facade.property.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PropertyPostRequestDto {

	private String description;

	private Integer deposit;

	private Integer monthlyRent;

	private BigDecimal area;

	private LocalDate approvalDate;

	private Integer currentFloor;

	private Integer totalFloors;

	private String address;

	// latitude
	private String y;

	// longitude
	private String x;

	private String dongcode;

	private List<Integer> options;

	// 사진추가 기능 해야됨
}
