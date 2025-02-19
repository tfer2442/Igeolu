package com.ssafy.igeolu.domain.property.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.ssafy.igeolu.domain.property.entity.EsProperty;

@Profile("prod")
public interface EsPropertyRepository extends ElasticsearchRepository<EsProperty, String>, CustomPropertyRepository {

}