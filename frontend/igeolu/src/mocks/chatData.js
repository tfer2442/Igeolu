// src/mocks/chatData.js
export const mockChatRooms = [
    {
      id: 1,
      name: '방 1',
      lastMessage: '안녕하세요!',
      messages: [
        { id: 1, content: '안녕하세요!', sender: 'other', created_at: '2024-01-27T10:00:00' },
        { id: 2, content: '반갑습니다!', sender: 'me', created_at: '2024-01-27T10:01:00' }
      ]
    },
    {
      id: 2,
      name: '방 2',
      lastMessage: '네, 알겠습니다.',
      messages: [
        { id: 1, content: '안녕하세요, 문의 드립니다.', sender: 'me', created_at: '2024-01-27T09:00:00' },
        { id: 2, content: '네, 알겠습니다.', sender: 'other', created_at: '2024-01-27T09:01:00' }
      ]
    }
  ];