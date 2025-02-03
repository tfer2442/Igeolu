package com.ssafy.igeolu.domain.propertyOption.entity;

import com.ssafy.igeolu.domain.option.entity.Option;
import com.ssafy.igeolu.domain.property.entity.Property;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class PropertyOption {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer propertyOptionId;

	@ManyToOne
	@JoinColumn(name = "property_id")
	private Property property;

	@ManyToOne
	@JoinColumn(name = "option_id")
	private Option option;

	//생성자
	public PropertyOption(Property property, Option option) {
		this.property = property;
		this.option = option;
	}


}
