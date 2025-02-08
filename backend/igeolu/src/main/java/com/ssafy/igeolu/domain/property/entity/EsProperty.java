package com.ssafy.igeolu.domain.property.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
@Document(indexName = "property-*") // 날짜 포함 인덱스 매칭 가능
public class EsProperty {

	@Id
	private Long id;

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

	@Field(type = FieldType.Date, name = "approval_date", format = DateFormat.date_optional_time)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private LocalDateTime approvalDate;

	@Field(type = FieldType.Date, name = "created_at", format = DateFormat.date_optional_time)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private LocalDateTime createdAt;

	@Field(type = FieldType.Date, name = "updated_at", format = DateFormat.date_optional_time)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
	private LocalDateTime updatedAt;

	@Field(type = FieldType.Long, name = "user_id")
	private Long userId;

	@Field(type = FieldType.Keyword, name = "image_urls")
	private List<String> imageUrls;

	@Field(type = FieldType.Integer, name = "option_ids")
	private List<Integer> optionIds;
}
