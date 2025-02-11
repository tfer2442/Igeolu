package com.ssafy.igeolu.facade.live.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;
import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.live.service.LivePropertyService;
import com.ssafy.igeolu.domain.live.service.LiveSessionService;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.service.PropertyService;
import com.ssafy.igeolu.domain.user.entity.Realtor;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStartPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStopPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.MemoPutRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LiveGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePropertyGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.SummaryPostResponseDto;
import com.ssafy.igeolu.facade.live.mapper.LivePropertyMapper;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.infra.naver.ClovaSpeechClient;
import com.ssafy.igeolu.infra.openai.PromptTemplateLoader;
import com.ssafy.igeolu.oauth.service.SecurityService;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.RecordingMode;
import io.openvidu.java.client.RecordingProperties;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveFacadeServiceImpl implements LiveFacadeService {
	private final PropertyService propertyService;
	private final SecurityService securityService;
	private final ClovaSpeechClient clovaSpeechClient;
	private final UserService userService;
	private final LiveSessionService liveSessionService;
	private final LivePropertyService livePropertyService;
	private final OpenVidu openVidu;
	private final ChatModel chatModel;
	private final PromptTemplateLoader promptLoader;

	@Override
	@Transactional
	public LivePostResponseDto startLive(StartLivePostRequestDto requestDto) {
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		LivePostResponseDto livePostResponseDto = createHostSessionAndToken();

		LiveSession liveSession = LiveSession.builder()
			.id(livePostResponseDto.getSessionId())
			.realtor(user)
			.build();

		// 라이브 세션 등록
		liveSessionService.registerLiveSession(liveSession);

		// 클라이언트가 전달한 propertyId 목록 순서를 가져옵니다.
		List<Integer> propertyIds = requestDto.getPropertyIds();
		// propertyId 목록으로 Property 리스트 조회
		List<Property> properties = propertyService.getPropertyListIds(propertyIds);

		// 조회된 properties를 클라이언트의 propertyIds 순서대로 재정렬합니다.
		Map<Integer, Property> propertyMap = properties.stream()
			.collect(Collectors.toMap(Property::getId, Function.identity()));
		List<Property> orderedProperties = propertyIds.stream()
			.map(propertyMap::get)
			.collect(Collectors.toList());

		// 재정렬된 orderedProperties를 라이브 매물로 등록
		livePropertyService.registerLiveProperties(orderedProperties, liveSession);

		Realtor realtor = userService.getRealtor(user);
		realtor.onLive();

		return livePostResponseDto;
	}

	@Override
	@Transactional
	public LivePostResponseDto joinLive(JoinLivePostRequestDto requestDto) {
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		LiveSession liveSession = liveSessionService.getLiveSession(requestDto.getSessionId());
		liveSession.setMember(user);

		return createMemberToken(requestDto.getSessionId());
	}

	@Override
	@Transactional(readOnly = true)
	public List<LiveGetResponseDto> getLives() {
		Integer userId = securityService.getCurrentUser().getUserId();
		User user = userService.getUserById(userId);

		List<LiveSession> liveSessions = liveSessionService.getLiveSessionsByMember(user);

		return liveSessions.stream()
			.map(liveSession -> LiveGetResponseDto.builder()
				.liveId(liveSession.getId())
				.realtorId(
					liveSession.getRealtor().getId()
				)
				.createdAt(liveSession.getCreatedAt())
				.build()
			)
			.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<LivePropertyGetResponseDto> getProperties(String liveId) {
		// todo: 자신이 본 매물인지 확인해야 함.
		LiveSession liveSession = liveSessionService.getLiveSession(liveId);
		List<LiveProperty> liveProperties = livePropertyService.getLiveProperties(liveSession);

		// Property id를 key로 하여 LiveProperty 전체를 매핑
		Map<Integer, LiveProperty> propertyIdToLiveProperty = liveProperties.stream()
			.collect(Collectors.toMap(
				lp -> lp.getProperty().getId(),
				Function.identity()
			));

		List<Property> properties = propertyService.getPropertyListIds(liveProperties.stream()
			.map(liveProperty -> liveProperty.getProperty().getId())
			.toList());

		// LiveProperty 객체를 통해 liveProperty id와 recordingId 모두를 전달
		return properties.stream()
			.map(property -> {
				LiveProperty liveProperty = propertyIdToLiveProperty.get(property.getId());
				return LivePropertyMapper.toDto(
					property,
					liveProperty.getId(),
					liveProperty.getRecordingId(),
					liveProperty.getMemo()
				);
			})
			.toList();
	}

	@Override
	public Recording startLiveProperty(Integer livePropertyId, LivePropertyStartPostRequestDto requestDto) {
		String sessionId = requestDto.getSessionId();

		// 빌더를 통해 녹화 속성 객체 생성
		RecordingProperties properties = new RecordingProperties.Builder()
			.name(livePropertyId.toString())
			.build();

		try {
			// 새 녹화 시작
			return openVidu.startRecording(sessionId, properties);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.debug("Error starting recording", e);
			throw new CustomException(ErrorCode.LIVE_PROPERTY_BAD_REQUEST);
		}
	}

	@Override
	@Transactional
	public void stopLiveProperty(Integer livePropertyId, LivePropertyStopPostRequestDto requestDto) {
		Recording recording = null;
		try {
			recording = openVidu.stopRecording(requestDto.getRecordingId());
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.debug("Error stopping recording", e);
			throw new CustomException(ErrorCode.LIVE_PROPERTY_BAD_REQUEST);
		}

		LiveProperty liveProperty = livePropertyService.getLiveProperty(livePropertyId);
		liveProperty.setRecordingId(recording.getId());
	}

	@Override
	public Recording getRecording(String recordingId) {
		try {
			return this.openVidu.getRecording(recordingId);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			throw new CustomException(ErrorCode.RECORDING_NOT_FOUND);
		}
	}

	@Override
	@Transactional
	public void editMemo(Integer livePropertyId, MemoPutRequestDto memoPutRequestDto) {
		LiveProperty liveProperty = livePropertyService.getLiveProperty(livePropertyId);
		liveProperty.setMemo(memoPutRequestDto.getMemo());
	}

	@Override
	@Transactional
	public SummaryPostResponseDto getLivePropertySummary(Integer livePropertyId) {
		LiveProperty liveProperty = livePropertyService.getLiveProperty(livePropertyId);

		// 요약을 한 적이 있다면, 반환
		if (liveProperty.getSummary() != null) {
			return SummaryPostResponseDto.builder()
				.summary(liveProperty.getSummary())
				.build();
		}

		// 요약을 한 적이 없다면, STT + AI 요약 실행

		// 필요에 따라 NestRequestEntity의 옵션을 설정할 수 있습니다.
		ClovaSpeechClient.NestRequestEntity requestEntity = new ClovaSpeechClient.NestRequestEntity();
		Recording recording = null;

		try {
			recording = this.openVidu.getRecording(liveProperty.getRecordingId());
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			throw new CustomException(ErrorCode.RECORDING_NOT_FOUND);
		}

		// 예: 콜백 URL이나 기타 옵션 지정
		// requestEntity.setCallback("https://your-callback-url.com");
		// STT 실행
		String stt = clovaSpeechClient.url(recording.getUrl(), requestEntity);

		// 요약 실행
		String summary = createLivePropertySummary(stt);
		liveProperty.setSummary(summary);

		return SummaryPostResponseDto.builder()
			.summary(summary)
			.build();
	}

	private String createLivePropertySummary(String stt) {
		try {
			// 유저 프롬프트 템플릿 로드 및 변수 설정
			String userPromptTemplate = promptLoader.loadUserPrompt();
			PromptTemplate userTemplate = new PromptTemplate(userPromptTemplate);
			userTemplate.add("stt_text", stt);
			String userCommand = userTemplate.render();

			// 시스템 프롬프트 로드
			String systemPromptTemplate = promptLoader.loadSystemPrompt();
			PromptTemplate systemTemplate = new PromptTemplate(systemPromptTemplate);
			String systemCommand = systemTemplate.render();

			// 메시지 생성
			Message userMessage = new UserMessage(userCommand);
			Message systemMessage = new SystemMessage(systemCommand);

			// AI 모델 호출
			return chatModel.call(userMessage, systemMessage);

		} catch (Exception e) {
			throw new CustomException(ErrorCode.OPENAI_INTERNAL_SERVER_ERROR);
		}
	}

	private LivePostResponseDto createHostSessionAndToken() {
		try {

			RecordingProperties recordingProperties = new RecordingProperties.Builder()
				.outputMode(Recording.OutputMode.COMPOSED)
				.frameRate(24)
				.build();

			// 1. 고유한 세션 ID 생성
			String sessionId = "igeolu-" + System.currentTimeMillis();

			// 2. 세션 속성 설정 (커스텀 세션 ID 사용)
			SessionProperties properties = new SessionProperties.Builder()
				.recordingMode(RecordingMode.MANUAL)
				.defaultRecordingProperties(recordingProperties)
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

	private LivePostResponseDto createMemberToken(String sessionId) {
		try {
			Session session = openVidu.getActiveSession(sessionId);

			if (session == null) {
				throw new CustomException(ErrorCode.LIVE_SESSION_NOT_FOUND);
			}

			ConnectionProperties connectionProps = new ConnectionProperties.Builder()
				.type(ConnectionType.WEBRTC)
				.role(OpenViduRole.PUBLISHER)
				.build();

			Connection connection = session.createConnection(connectionProps);
			String token = connection.getToken();

			return LivePostResponseDto.builder()
				.sessionId(sessionId)
				.token(token)
				.build();
		} catch (Exception e) {
			throw new CustomException(ErrorCode.LIVE_SESSION_NOT_FOUND);
		}
	}

}
