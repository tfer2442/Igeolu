package com.ssafy.igeolu.facade.chatroom.service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.service.ChatMessageService;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.entity.RoomStatus;
import com.ssafy.igeolu.domain.chatroom.service.ChatRoomService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomPostRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomListGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomPostResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatRoomFacadeServiceImpl implements ChatRoomFacadeService {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final UserService userService;
    private final SecurityService securityService;

    @Override
    public ChatRoomPostResponseDto createChatRoom(ChatRoomPostRequestDto request) {

        Integer memberId = securityService.getCurrentUser().getUserId();
        Integer realtorId = request.getRealtorId();

        User member = userService.getUserById(memberId);
        User realtor = userService.getUserById(realtorId);

        ChatRoom chatRoom = chatRoomService.createChatRoom(member, realtor);
        return ChatRoomPostResponseDto.builder()
                .id(chatRoom.getId())
                .build();
    }

    @Override
    public List<ChatRoomListGetResponseDto> getChatRoomList() {

        User user = userService.getUserById(securityService.getCurrentUser().getUserId());

        List<ChatRoom> chatRoomList = chatRoomService.getChatRoomList(user);

        return chatRoomList.stream()
                .map(cr -> {

                            User opponentUser = chatRoomService.getOpponentUser(cr, user);
                            Long unreadCount = chatMessageService.countUnreadMessages(user.getId(), cr.getId()).block();
                            ChatMessage lastMessage = chatMessageService.getLastMessage(cr.getId()).block();

                            // lastMessage가 null인 경우를 걸러냄
                            // 대화방을 만들었지만 메세지를 시작하지 않은 경우임
                            String message;
                            LocalDateTime createdAt;
                            if (lastMessage == null) {
                                message = "메세지를 시작해주세요!";
                                createdAt = LocalDateTime.now();
                            } else {
                                message = lastMessage.getContent();
                                createdAt = lastMessage.getCreatedAt();
                            }

                            return ChatRoomListGetResponseDto.builder()
                                    .roomId(cr.getId())
                                    .userId(opponentUser.getId())
                                    .userName(opponentUser.getUsername())
                                    .userProfileUrl(
                                            opponentUser.getProfileFilePath() == null || opponentUser.getProfileFilePath().isEmpty()
                                                    ? userService.getDefaultProfilePath(opponentUser.getRole()) :
                                                    opponentUser.getProfileFilePath())
                                    .unreadCount(unreadCount)
                                    .lastMessage(message)
                                    .roomStatus(cr.getRoomStatus())
                                    .updatedAt(createdAt)
                                    .build();
                        }
                )
                .sorted((o1, o2) -> o2.getUpdatedAt().compareTo(o1.getUpdatedAt()))
                .toList();
    }

    @Override
    public void leaveChatRoom(Integer chatRoomId) {

        ChatRoom chatRoom = chatRoomService.getChatRoom(chatRoomId);
        User user = securityService.getUserEntity();

        // 채팅방 상태 변경
        chatRoomService.updateChatRoomStatus(chatRoom, user);

        // 나간 사람에 대해 메세지 마킹
        chatMessageService.markLastExitRoomMessage(user.getId(), chatRoomId).subscribe();

        if (chatRoom.getRoomStatus() == RoomStatus.NONE) {
            chatMessageService.deleteAllMessagesByRoomId(chatRoomId).subscribe();
            chatRoomService.leaveChatRoom(chatRoom);
        }
    }
}
