package com.ssafy.igeolu.domain.chatmessage.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_room_status") // 사용자별 채팅방 상태 관리 컬렉션
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoomStatus {
    @Id
    private ObjectId id;
    private Integer userId;
    private Integer roomId;

    // 유저가 해당방에서 마지막으로 읽은 메시지 ID
    private ObjectId lastReadMessageId;

    // 유저가 해당방에서 나갔을때의 마지막 메시지 ID
    private ObjectId lastExitRoomMessageId;
}
