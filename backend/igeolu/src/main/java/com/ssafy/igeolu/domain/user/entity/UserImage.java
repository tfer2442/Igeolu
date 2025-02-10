	package com.ssafy.igeolu.domain.user.entity;

	import java.time.LocalDateTime;

	import org.springframework.data.annotation.CreatedDate;
	import org.springframework.data.annotation.LastModifiedDate;
	import org.springframework.data.jpa.domain.support.AuditingEntityListener;

	import com.ssafy.igeolu.domain.property.entity.Property;

	import jakarta.persistence.CascadeType;
	import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.EntityListeners;
	import jakarta.persistence.FetchType;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.ManyToOne;
	import jakarta.persistence.OneToOne;
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
	public class UserImage {

		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Integer id;

		private String filePath;

		@OneToOne(fetch = FetchType.LAZY)
		private User user;

		@CreatedDate
		@Column(updatable = false)
		private LocalDateTime createdAt;

		@LastModifiedDate
		private LocalDateTime updatedAt;
	}
