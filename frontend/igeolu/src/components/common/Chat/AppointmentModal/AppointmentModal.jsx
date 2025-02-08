// src/components/common/Chat/AppointmentModal/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import { useAppointment } from '../../../../contexts/AppointmentContext';
import './AppointmentModal.css';

const AppointmentModal = ({ onClose, roomInfo, currentUserId }) => {
  const { addAppointment } = useAppointment();
  const [animationState, setAnimationState] = useState('entering');
  const [formData, setFormData] = useState({
    scheduledAt: '',
    title: '',
    userId: currentUserId,
    opponentUserId: roomInfo.userId,
    chatRoomId: roomInfo.roomId,
  });

  const handleClose = () => {
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 지속 시간과 동일하게 설정
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

      const newAppointment = {
        appointmentId: response.data.appointmentId, // 이 부분이 제대로 들어오는지 확인
        scheduledAt: isoDate,
        title: formData.title,
        opponentName: roomInfo.userName,
        opponentUserId: roomInfo.userId,
        userId: currentUserId,
      };

      console.log('Adding new appointment:', newAppointment);
      addAppointment(newAppointment);
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
  }, []);

  return (
    <>
      <div
        className={`modal-overlay ${animationState}`}
        onClick={handleClose}
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
};

export default AppointmentModal;
