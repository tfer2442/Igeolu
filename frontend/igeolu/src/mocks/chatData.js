// src/mocks/chatData.js
import testProfile from '../assets/images/testprofile.jpg';

export const mockChatRooms = [
  {
    roomId: 1,
    userId: 1,
    userName: "홍길동",
    userProfileUrl: testProfile,
    unreadCount: 3,
    lastMessage: "안녕하세요, 매물 문의드립니다.",
    createdAt: "2024-02-02T10:30:00"
  },
  {
    roomId: 2,
    userId: 2,
    userName: "김철수",
    userProfileUrl: null,
    unreadCount: 0,
    lastMessage: "네, 확인해보고 연락드리겠습니다.",
    createdAt: "2025-02-02T09:15:00"
  },
  {
    roomId: 3,
    userId: 3,
    userName: "이영희",
    userProfileUrl: null,
    unreadCount: 10,
    lastMessage: "방문 가능한 시간을 알려주세요.",
    createdAt: "2024-02-01T18:20:00"
  },
  {
    roomId: 4,
    userId: 4,
    userName: "이영희",
    userProfileUrl: null,
    unreadCount: 100,
    lastMessage: "방문 가능한 시간을 알려주세요.",
    createdAt: "2024-02-01T18:20:00"
  }
];

export const mockChatMessages = {
  1: [ // roomId: 1의 메시지들
    {
      messageId: 1,
      userId: 123456, // 현재 사용자 ID
      content: "안녕하세요, 매물 문의드립니다.",
      createdAt: "2024-02-02T10:30:00"
    },
    {
      messageId: 2,
      userId: 1, // 상대방 ID
      content: "네, 어떤 점이 궁금하신가요?",
      createdAt: "2024-02-02T10:31:00"
    },
    {
      messageId: 3,
      userId: 123456, // 현재 사용자 ID
      content: "전용면적과 방향이 궁금합니다.",
      createdAt: "2024-02-02T10:32:00"
    }
  ],
  2: [ // roomId: 2의 메시지들
    {
      messageId: 4,
      userId: 2,
      content: "주차 가능한가요?",
      createdAt: "2024-02-02T09:15:00"
    },
    {
      messageId: 5,
      userId: 123456,
      content: "네, 확인해보고 연락드리겠습니다.",
      createdAt: "2024-02-02T09:16:00"
    }
  ]
};



export const mockUserProfiles = {
  1: {
    userName: "홍길동",
    profileUrl: testProfile
  },
  2: {
    userName: "형길동",
    profileUrl: "/path/to/profile.jpg"
  },
  3: {
    userName: "홍킬동",
    profileUrl: "/path/to/profile.jpg"
  },
  4: {
    userName: "홍길똥",
    profileUrl: "/path/to/profile.jpg"
  },
};