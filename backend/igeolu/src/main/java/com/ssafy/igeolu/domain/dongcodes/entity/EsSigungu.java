package com.ssafy.igeolu.domain.dongcodes.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "sigungu-*") // 날짜 포함 인덱스 매칭 가능
public class EsSigungu {

	@Id
	private String id; // Elasticsearch의 _id 필드와 매핑

	@Field(type = FieldType.Keyword, name = "sigungu")
	private String sigungu;
}
