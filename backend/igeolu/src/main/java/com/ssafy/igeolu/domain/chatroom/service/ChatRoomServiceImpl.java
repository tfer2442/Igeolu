package com.ssafy.igeolu.domain.chatroom.service;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.entity.RoomStatus;
import com.ssafy.igeolu.domain.chatroom.repository.ChatRoomRepository;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Override
    public ChatRoom getChatRoom(Integer id) {
        return chatRoomRepository.findById(id).orElseThrow();
    }

    @Override
    public ChatRoom createChatRoom(User member, User realtor) {
        return chatRoomRepository.findByMemberAndRealtor(member, realtor)
                .map(existingRoom -> {
                    switch (existingRoom.getRoomStatus()) {
                        case BOTH -> throw new RuntimeException("이미 채팅방이 존재합니다.");
                        case MEMBER, REALTOR -> existingRoom.setRoomStatus(RoomStatus.BOTH);
                    }
                    log.info("Dadf " + existingRoom.getRoomStatus());
                    return existingRoom;
                })
                // 채팅방이 없다면 새로 생성
                .orElseGet(() -> chatRoomRepository.save(ChatRoom.builder()
                        .member(member)
                        .realtor(realtor)
                        .build()));
    }


    @Override
    public List<ChatRoom> getChatRoomList(User user) {

        if (user.getRole() == Role.ROLE_MEMBER) {
            return chatRoomRepository.findByMember(user);
        }

        if (user.getRole() == Role.ROLE_REALTOR) {
            return chatRoomRepository.findByRealtor(user);
        }

        throw new RuntimeException("잘못된 유저 역할을 가진 접근입니다.");
    }

    @Override
    public User getOpponentUser(ChatRoom chatRoom, User user) {
        if (chatRoom.getMember().equals(user)) {
            return chatRoom.getRealtor();
        }

        if (chatRoom.getRealtor().equals(user)) {
            return chatRoom.getMember();
        }

        throw new RuntimeException("잘못된 상대방 입니다.");
    }

    @Override
    public void leaveChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.delete(chatRoom);
    }

    @Override
    public void updateChatRoomStatus(ChatRoom chatRoom, User user) {

        chatRoom.setRoomStatus(switch (chatRoom.getRoomStatus()) {
            case BOTH -> chatRoom.getMember().equals(user) ? RoomStatus.REALTOR
                    : chatRoom.getRealtor().equals(user) ? RoomStatus.MEMBER
                    : RoomStatus.BOTH;
            case MEMBER -> chatRoom.getMember().equals(user) ? RoomStatus.NONE : RoomStatus.MEMBER;
            case REALTOR -> chatRoom.getRealtor().equals(user) ? RoomStatus.NONE : RoomStatus.REALTOR;
            default -> chatRoom.getRoomStatus();
        });
    }
}
