package com.ssafy.igeolu.domain.property.repository;

import com.ssafy.igeolu.domain.property.entity.EsProperty;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomPropertyRepository {

    List<EsProperty> findBy(String keyword,
                            String sidoName,
                            String gugunName,
                            String dongName,
                            Integer maxDeposit,
                            Integer maxMonthlyRent,
                            List<Integer> optionIds,
                            Pageable pageable);

}
