**서비스 관련 파일들**:

- `baseWebSocket.js`: WebSocket 연결의 기본 기능(연결, 재연결, 구독 등)을
  제공하는 추상 클래스
- `chatWebSocket.js`: 개별 채팅방의 실시간 메시지 처리를 담당하는 WebSocket
  클래스
- `chatRoomsWebSocket.js`: 채팅방 목록의 실시간 업데이트를 처리하는 WebSocket
  클래스
- `chatApi.js`: 채팅 관련 REST API 호출(채팅방 생성, 메시지 조회 등)을 담당하는
  서비스

**컴포넌트 관련 파일들**:

- `App.js`: 전체 앱의 라우팅과 채팅 인터페이스를 관리하는 최상위 컴포넌트
- `ChatButton.jsx`: 채팅 인터페이스를 열고 닫는 플로팅 버튼 컴포넌트
- `ChatMessage.jsx`: 개별 채팅 메시지의 표시를 담당하는 컴포넌트
- `ChatModal.jsx`: 채팅방 목록을 모달 형태로 표시하는 컴포넌트
- `ChatRoom.jsx`: 실제 채팅이 이루어지는 채팅방 인터페이스 컴포넌트
- `ChatRoomList.jsx`: 사용 가능한 채팅방 목록을 표시하는 컴포넌트
- `SlideLayout.jsx`: 채팅 인터페이스를 슬라이드 형태로 표시하는 레이아웃
  컴포넌트

**모바일 관련 파일들**:

- `MobileChatList.jsx`: 모바일 환경의 채팅방 목록 페이지 컴포넌트
- `MobileChatRoom.jsx`: 모바일 환경의 채팅방 페이지 컴포넌트

**그 외**

- `constants.js`: 임시 상수
- `dateFormat.js`: 채팅방 목록에 나오는 날짜 표시 형식
