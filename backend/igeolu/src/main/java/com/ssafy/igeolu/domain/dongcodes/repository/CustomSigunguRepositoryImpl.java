package com.ssafy.igeolu.domain.dongcodes.repository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.dongcodes.entity.EsSigungu;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomSigunguRepositoryImpl implements CustomSigunguRepository {

	private final ElasticsearchOperations elasticsearchOperations;

	public List<EsSigungu> searchSigungu(String keyword, Pageable pageable) {
		try {
			Query query = createSearchQuery(keyword);
			query.setPageable(pageable);
			SearchHits<EsSigungu> searchHits = elasticsearchOperations.search(query, EsSigungu.class);

			return searchHits.getSearchHits()
				.stream()
				.map(SearchHit::getContent)
				.collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("검색 실패!", e);
		}
	}

	private Query createSearchQuery(String keyword) {
		Criteria criteria = new Criteria("sigungu").matches(keyword).boost(2.0f)
			.or(new Criteria("sigungu.kor").matches(keyword)).boost(1.5f)
			.or(new Criteria("sigungu.edge").matches(keyword)).boost(1.0f)
			.or(new Criteria("sigungu.partial").matches(keyword)).boost(0.5f);

		return new CriteriaQuery(criteria);
	}
}
