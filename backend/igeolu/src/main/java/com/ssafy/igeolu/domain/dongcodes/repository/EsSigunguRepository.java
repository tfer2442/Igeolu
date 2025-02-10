package com.ssafy.igeolu.domain.dongcodes.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.ssafy.igeolu.domain.dongcodes.entity.EsSigungu;

@Profile("prod")
public interface EsSigunguRepository extends ElasticsearchRepository<EsSigungu, String>, CustomSigunguRepository {

}
