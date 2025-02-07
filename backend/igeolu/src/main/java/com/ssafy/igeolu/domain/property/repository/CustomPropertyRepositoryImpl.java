package com.ssafy.igeolu.domain.property.repository;

import java.util.List;

import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.property.entity.EsProperty;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomPropertyRepositoryImpl implements CustomPropertyRepository {

	private final ElasticsearchOperations elasticsearchOperations;

	@Override
	public List<EsProperty> findBy(String keyword,
		String sidoName,
		String gugunName,
		String dongName,
		Integer maxDeposit,
		Integer maxMonthlyRent,
		List<Integer> optionIds) {

		// 동적 CriteriaQuery 생성
		Criteria criteria = new Criteria();

		// 1. 키워드 (집주소 검색)
		if (keyword != null && !keyword.isEmpty()) {
			criteria = criteria.and("address").matches(keyword);
		}

		// 2. 시/도, 구/군, 동명 필터링
		if (sidoName != null && !sidoName.isEmpty()) {
			criteria = criteria.and("sidoName").is(sidoName);
		}
		if (gugunName != null && !gugunName.isEmpty()) {
			criteria = criteria.and("gugunName").is(gugunName);
		}
		if (dongName != null && !dongName.isEmpty()) {
			criteria = criteria.and("dongName").is(dongName);
		}

		// 3. 최대 보증금 및 최대 월세 필터링
		if (maxDeposit != null) {
			criteria = criteria.and("deposit").lessThanEqual(maxDeposit);
		}
		if (maxMonthlyRent != null) {
			criteria = criteria.and("monthlyRent").lessThanEqual(maxMonthlyRent);
		}

		// 4. 옵션 ID 필터링
		if (optionIds != null && !optionIds.isEmpty()) {
			for (Integer optionId : optionIds) {
				criteria = criteria.and("optionIds").contains(String.valueOf(optionId));
			}
		}

		// 5. 쿼리 실행
		SearchHits<EsProperty> searchHits = elasticsearchOperations.search(new CriteriaQuery(criteria),
			EsProperty.class);

		// 6. 결과 변환 후 반환
		return searchHits.stream()
			.map(SearchHit::getContent)
			.toList();
	}
}
