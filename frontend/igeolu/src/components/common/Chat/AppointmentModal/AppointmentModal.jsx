// src/components/common/Chat/AppointmentModal/AppointmentModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import './AppointmentModal.css';

const AppointmentModal = ({ onClose, roomInfo, currentUserId, sendSystemMessage }) => {
  const [animationState, setAnimationState] = useState('entering');
  const [formData, setFormData] = useState({
    scheduledAt: '',
    title: '',
    memberId: roomInfo.userId,
    chatRoomId: roomInfo.roomId,
    appointmentType: "LIVE",
  });

  const handleClose = useCallback(() => {
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      appointmentType: e.target.checked ? "LIVE" : "COMMON"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();

      const response = await appointmentAPI.createAppointment({
        ...formData,
        scheduledAt: isoDate,
      });

      console.log('Create appointment response:', response.data);

      // 약속 생성 성공 시 시스템 메시지 전송
      const appointmentDate = new Date(isoDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const systemMessage = `새로운 약속이 생성되었습니다.\n일시: ${appointmentDate}\n제목: ${formData.title}`;
      await sendSystemMessage(systemMessage);

      const newAppointment = {
        appointmentId: response.data.appointmentId, // 이 부분이 제대로 들어오는지 확인
        scheduledAt: isoDate,
        title: formData.title,
        opponentName: roomInfo.userName,
        opponentUserId: roomInfo.userId,
        userId: currentUserId,
      };

      console.log('Adding new appointment:', newAppointment);
      handleClose();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClose]);

  return (
    <>
      <div
        className={`appointment-modal-overlay ${animationState}`}
        onClick={handleClose}
        onKeyDown={handleClose}
        role='button'
        tabIndex={0}
        aria-label='Close modal'
      />
      <div className={`appointment-modal ${animationState}`}>
        <div className='appointment-modal-content'>
          <h2>약속 생성</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='scheduledAt'>날짜 및 시간</label>
              <input
                type='datetime-local'
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='title'>제목</label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className='form-group checkbox-group'>
              <label>
                <input
                  type='checkbox'
                  checked={formData.appointmentType === "LIVE"}
                  onChange={handleTypeChange}
                />
                라이브 약속인가요?
              </label>
            </div>
            <div className='button-group'>
              <button type='submit'>생성</button>
              <button type='button' onClick={handleClose}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

AppointmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  roomInfo: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    roomId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.number.isRequired,
  sendSystemMessage: PropTypes.func.isRequired,
};

export default AppointmentModal;
