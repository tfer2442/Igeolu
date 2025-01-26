package com.ssafy.igeolu.domain.property.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Property {
	@Id
	@Column(name = "id")
	private Integer id;

}
