package com.ssafy.igeolu.domain.option.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "property_options")
public class Option {
	@Id
	private Integer id;

	@Enumerated(EnumType.STRING)
	private OptionName name;
}
