package com.ssafy.igeolu.domain.property.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Getter;

@Getter
@Document(indexName = "property") // Elasticsearch에 저장될 인덱스 이름
public class EsProperty {

	@Id
	private Integer id;

	@Field(type = FieldType.Text)
	private String description;

	@Field(type = FieldType.Integer)
	private Integer deposit;

	@Field(type = FieldType.Integer)
	private Integer monthlyRent;

	@Field(type = FieldType.Double)
	private BigDecimal area;

	@Field(type = FieldType.Integer)
	private Integer currentFloor;

	@Field(type = FieldType.Integer)
	private Integer totalFloors;

	@Field(type = FieldType.Text)
	private String address;

	@Field(type = FieldType.Double)
	private BigDecimal latitude;

	@Field(type = FieldType.Double)
	private BigDecimal longitude;

	@Field(type = FieldType.Date)
	private LocalDateTime createdAt;

	@Field(type = FieldType.Keyword)
	private String dongcode;

	@Field(type = FieldType.Text)
	private String sidoName;

	@Field(type = FieldType.Text)
	private String gugunName;

	@Field(type = FieldType.Text)
	private String dongName;

	@Field(type = FieldType.Integer)
	private List<Integer> optionIds;

	@Field(type = FieldType.Keyword)
	private List<String> images;
}
