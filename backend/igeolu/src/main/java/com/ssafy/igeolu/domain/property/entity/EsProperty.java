package com.ssafy.igeolu.domain.property.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "property-*") // 날짜 포함 인덱스 매칭 가능
public class EsProperty {

	@Id
	private String id; // Elasticsearch의 _id 필드와 매핑

	@Field(type = FieldType.Integer, name = "id")
	private Integer propertyId; // property_id

	@Field(type = FieldType.Text)
	private String description;

	@Field(type = FieldType.Integer)
	private Integer deposit;

	@Field(type = FieldType.Integer, name = "monthly_rent")
	private Integer monthlyRent;

	@Field(type = FieldType.Double)
	private BigDecimal area;

	@Field(type = FieldType.Integer, name = "current_floor")
	private Integer currentFloor;

	@Field(type = FieldType.Integer, name = "total_floors")
	private Integer totalFloors;

	@Field(type = FieldType.Text)
	private String address;

	@Field(type = FieldType.Text, name = "sido_name")
	private String sidoName;

	@Field(type = FieldType.Text, name = "gugun_name")
	private String gugunName;

	@Field(type = FieldType.Text, name = "dong_name")
	private String dongName;

	@Field(type = FieldType.Keyword, name = "dong_code")
	private String dongCode;

	@Field(type = FieldType.Double)
	private BigDecimal latitude;

	@Field(type = FieldType.Double)
	private BigDecimal longitude;

	@Field(type = FieldType.Date, name = "approval_date")
	private String approvalDate;

	@Field(type = FieldType.Date, name = "created_at")
	private String createdAt;

	@Field(type = FieldType.Date, name = "updated_at")
	private String updatedAt;

	@Field(type = FieldType.Integer, name = "user_id")
	private Integer userId;

	@Field(type = FieldType.Keyword, name = "image_urls")
	private List<String> imageUrls;

	@Field(type = FieldType.Integer, name = "option_ids")
	private List<Integer> optionIds;

	public LocalDate getApprovalDate() {
		return approvalDate != null ?
			LocalDate.parse(approvalDate.substring(0, 10)) : null;  // 날짜 부분만 추출하여 변환
	}

	public LocalDateTime getCreatedAt() {
		return createdAt != null ?
			LocalDateTime.parse(createdAt.substring(0, 19)) : null;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt != null ?
			LocalDateTime.parse(updatedAt.substring(0, 19)) : null;
	}
}
