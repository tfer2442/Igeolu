package com.ssafy.igeolu.domain.live.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.igeolu.domain.property.entity.Property;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
public class LiveProperty {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String liveVideoPath;

	@ManyToOne(fetch = FetchType.LAZY)
	private Property property;

	@ManyToOne(fetch = FetchType.LAZY)
	private LiveSession liveSession;
}
