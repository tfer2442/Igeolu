// src/components/common/Chat/ChatExtras/ChatExtras.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import liveIcon from '../../../../assets/images/liveButton.png';
import reservationIcon from '../../../../assets/images/reservationButton.png';
import AppointmentModal from '../AppointmentModal/AppointmentModal';
import './ChatExtras.css';

const ChatExtras = ({
  isOpen,
  room,
  currentUserId,
  onClose,
  sendSystemMessage,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAppointmentClick = () => {
    setIsAnimating(true);
    // 애니메이션이 완료된 후 모달 열기
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setIsModalOpen(true);
      }, 100);
    }, 300); // transition 지속 시간과 동일하게 설정
  };

  // isOpen이 변경될 때마다 애니메이션 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isOpen]);

  const handleLiveClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      navigate('/mobile-live-setting', {
        state: {
          roomId: room.roomId,
          userId: currentUserId  // 필요한 경우 userId도 전달
        }
      });
    }, 300);
  };

  return (
    <>
      <div
        className={`chat-extras ${isOpen ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
      >
        <div className='chat-extras-content'>
        <button 
            className='extra-button'
            onClick={handleLiveClick}
          >
            <div className='icon-circle'>
              <img src={liveIcon} alt='라이브' />
            </div>
            <span>라이브</span>
          </button>
          <button className='extra-button' onClick={handleAppointmentClick}>
            <div className='icon-circle'>
              <img src={reservationIcon} alt='예약' />
            </div>
            <span>예약</span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AppointmentModal
          onClose={() => setIsModalOpen(false)}
          roomInfo={room}
          currentUserId={currentUserId}
          sendSystemMessage={sendSystemMessage}
        />
      )}
    </>
  );
};

ChatExtras.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  room: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  sendSystemMessage: PropTypes.func.isRequired,
};

export default ChatExtras;
