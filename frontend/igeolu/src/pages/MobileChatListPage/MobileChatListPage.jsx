// pages/MobileChatListPage/MobileChatListPage.jsx
import React, {useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import ChatRoomList from '../../components/common/Chat/ChatRoomList/ChatRoomList';
import './MobileChatListPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import mobileDefaultProfile from '../../assets/images/defaultProfileImageIMSI.png';
import MobileTopBar from '../../components/MobileTopBar/MobileTopBar';

const MobileChatList = ({ chatRooms, isLoading, error, onRetry: originalOnRetry  }) => {
  const navigate = useNavigate();
  const { user } = useUser(); 

// onRetry를 래핑하여 userRole 전달
const handleRetry = useCallback(async () => {
  if (!user?.role) {
    console.warn('User role not available yet');
    return;
  }
  await originalOnRetry(user.role);
}, [user?.role, originalOnRetry]);

useEffect(() => {
  if (user?.role) {
    handleRetry();
  }
}, [user?.role, handleRetry]); // user.role이 변경될 때마다 실행


  const handleSelectRoom = (room) => {
    navigate(`/mobile-chat/${room.roomId}`);
  };

  return (
    <div className='mobile-chat-list-page-container'>
      <div className='mobile-chat-list'>
        <MobileTopBar title="채팅" />

        <div className='mobile-chat-content'>
          {isLoading ? (
            <div className='mobile-loading-state'>로딩 중...</div>
          ) : error ? (
            <div className='mobile-error-state'>
              <p>{error}</p>
              <button onClick={handleRetry} className='retry-button'>
                다시 시도
              </button>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className='mobile-empty-state'>아직 채팅방이 없습니다.</div>
          ) : (
            <ChatRoomList
              rooms={chatRooms}
              onSelectRoom={handleSelectRoom}
              isMobile={true}
              defaultProfileImage={mobileDefaultProfile}
            />
          )}
        </div>
        <MobileBottomTab />
      </div>
    </div>
  );
};

MobileChatList.propTypes = {
  chatRooms: PropTypes.arrayOf(
    PropTypes.shape({
      roomId: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
      userProfileUrl: PropTypes.string,
      unreadCount: PropTypes.number.isRequired,
      updatedAt: PropTypes.string.isRequired,
      lastMessage: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
};

export default MobileChatList;
