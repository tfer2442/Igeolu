package com.ssafy.igeolu.domain.property.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.ssafy.igeolu.domain.property.entity.EsProperty;

public interface EsPropertyRepository extends ElasticsearchRepository<EsProperty, String>, CustomPropertyRepository {

}