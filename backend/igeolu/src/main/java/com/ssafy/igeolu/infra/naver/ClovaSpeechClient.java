package com.ssafy.igeolu.infra.naver;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.Header;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.message.BasicHeader;

import com.google.gson.Gson;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ClovaSpeechClient {

	private final String secret;
	private final String invokeUrl;
	private final CloseableHttpClient httpClient;
	private final Gson gson;
	private final Header[] headers;

	// 생성자 주입을 통해 secret과 invokeUrl을 설정
	public ClovaSpeechClient(String secret, String invokeUrl) {
		this.secret = secret;
		this.invokeUrl = invokeUrl;
		this.httpClient = HttpClients.createDefault();
		this.gson = new Gson();
		this.headers = new Header[] {
			new BasicHeader("Accept", "application/json"),
			new BasicHeader("X-CLOVASPEECH-API-KEY", secret)
		};
	}

	// --- 내부 DTO 클래스들 --- //

	@Data
	public static class Boosting {
		private String words;
	}

	@Data
	public static class Diarization {
		private Boolean enable = Boolean.FALSE;
		private Integer speakerCountMin;
		private Integer speakerCountMax;
	}

	@Data
	public static class Sed {
		private Boolean enable = Boolean.FALSE;
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class NestRequestEntity {
		private String language = "ko-KR";
		// completion: sync 또는 async (기본값: sync)
		private String completion = "sync";
		// callback URL (선택)
		private String callback;
		// userdata (선택, 임의의 데이터)
		private Map<String, Object> userdata;
		private Boolean wordAlignment = Boolean.TRUE;
		private Boolean fullText = Boolean.TRUE;
		// keyword boosting 객체 배열
		private List<Boosting> boostings;
		// 쉼표 구분 키워드
		private String forbiddens;
		private Diarization diarization;
		private Sed sed;
	}

	/**
	 * 외부 파일 URL을 이용한 음성 인식 요청
	 * @param url 외부 파일 URL (필수)
	 * @param nestRequestEntity 추가 파라미터 (선택)
	 * @return 인식 결과 문자열
	 */
	public String url(String url, NestRequestEntity nestRequestEntity) {
		HttpPost httpPost = new HttpPost(invokeUrl + "/recognizer/url");
		httpPost.setHeaders(headers);
		Map<String, Object> body = new HashMap<>();
		body.put("url", url);
		body.put("language", nestRequestEntity.getLanguage());
		body.put("completion", nestRequestEntity.getCompletion());
		body.put("callback", nestRequestEntity.getCallback());
		body.put("userdata", nestRequestEntity.getUserdata());
		body.put("wordAlignment", nestRequestEntity.getWordAlignment());
		body.put("fullText", nestRequestEntity.getFullText());
		body.put("forbiddens", nestRequestEntity.getForbiddens());
		body.put("boostings", nestRequestEntity.getBoostings());
		body.put("diarization", nestRequestEntity.getDiarization());
		body.put("sed", nestRequestEntity.getSed());
		HttpEntity httpEntity = new StringEntity(gson.toJson(body), ContentType.APPLICATION_JSON);
		httpPost.setEntity(httpEntity);
		return execute(httpPost);
	}

	private String execute(HttpPost httpPost) {
		try (final CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
			final HttpEntity entity = httpResponse.getEntity();
			return EntityUtils.toString(entity, StandardCharsets.UTF_8);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
