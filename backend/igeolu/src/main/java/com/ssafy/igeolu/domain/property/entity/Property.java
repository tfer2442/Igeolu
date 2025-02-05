package com.ssafy.igeolu.domain.property.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.domain.propertyOption.entity.PropertyOption;
import com.ssafy.igeolu.domain.user.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
public class Property {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String description;

	private Integer deposit;

	private Integer monthlyRent;

	@Column(precision = 10, scale = 2)
	private BigDecimal area;

	private LocalDate approvalDate;

	private Integer currentFloor;

	private Integer totalFloors;

	private String address;

	@Column(precision = 20, scale = 17)
	private BigDecimal latitude;

	@Column(precision = 20, scale = 17)
	private BigDecimal longitude;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dong_code")
	private Dongcodes dongcode;

	@Builder.Default
	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
	private List<PropertyOption> propertyOptions = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
	private List<PropertyImage> propertyImages = new ArrayList<>();

	public void addPropertyOption(PropertyOption propertyOption) {
		propertyOptions.add(propertyOption);
		propertyOption.setProperty(this);
	}

	public void removePropertyOption(PropertyOption propertyOption) {
		propertyOptions.remove(propertyOption);
		propertyOption.setProperty(null);
	}

	public void addPropertyImage(PropertyImage propertyImage) {
		propertyImages.add(propertyImage);
		propertyImage.setProperty(this);
	}
}

