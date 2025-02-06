package com.ssafy.igeolu.facade.live.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.live.service.LivePropertyService;
import com.ssafy.igeolu.domain.live.service.LiveSessionService;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.service.PropertyService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.service.SecurityService;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiveFacadeServiceImpl implements LiveFacadeService {
	private final PropertyService propertyService;
	private final SecurityService securityService;
	private final UserService userService;
	private final LiveSessionService liveSessionService;
	private final LivePropertyService livePropertyService;
	private final OpenVidu openVidu;

	@Override
	@Transactional
	public LivePostResponseDto startLive(StartLivePostRequestDto requestDto) {
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		LiveSession liveSession = LiveSession.builder()
			.realtor(user)
			.build();

		// 라이브 세션 등록
		liveSessionService.registerLiveSession(liveSession);

		List<Property> properties = propertyService.getPropertyListIds(requestDto.getPropertyIds());

		// 라이브 매물에 등록
		livePropertyService.registerLiveProperties(properties, liveSession);

		return createHostSessionAndToken();
	}

	private LivePostResponseDto createHostSessionAndToken() {
		try {
			// 1. 고유한 세션 ID 생성
			String sessionId = "igeolu-" + System.currentTimeMillis();

			// 2. 세션 속성 설정 (커스텀 세션 ID 사용)
			SessionProperties properties = new SessionProperties.Builder()
				.customSessionId(sessionId)
				.build();

			// 3. OpenVidu 서버에 새로운 세션 생성
			Session session = openVidu.createSession(properties);

			// 4. 연결 속성 설정 (퍼블리셔 역할로 설정, 데이터는 리얼터 ID를 String으로 변환)
			ConnectionProperties connectionProps = new ConnectionProperties.Builder()
				.type(ConnectionType.WEBRTC)
				.role(OpenViduRole.MODERATOR) // host 설정
				.build();

			// 5. 세션에 연결 생성 후 토큰 발급
			Connection connection = session.createConnection(connectionProps);
			String token = connection.getToken();

			return LivePostResponseDto.builder()
				.sessionId(sessionId)
				.token(token)
				.build();
		} catch (Exception e) {
			throw new CustomException(ErrorCode.LIVE_SESSION_NOT_CREATE);
		}
	}
}
