// src/components/common/Chat/EditAppointmentModal/EditAppointmentModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import './EditAppointmentModal.css';

const EditAppointmentModal = ({ appointment, onClose, onUpdate }) => {
  const [animationState, setAnimationState] = useState('entering');
  const [formData, setFormData] = useState({
    scheduledAt: appointment.scheduledAt,
    title: appointment.title,
    userId: appointment.userId,
    opponentUserId: appointment.opponentUserId,
  });

  const handleClose = useCallback(() => {
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 컴포넌트가 마운트되거나 appointment가 변경될 때 formData 업데이트
    const date = new Date(appointment.scheduledAt);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setFormData({
      scheduledAt: localDate,
      title: appointment.title,
      userId: appointment.userId,
      opponentUserId: appointment.opponentUserId,
    });

    // Add escape key handler
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [appointment, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();

      await appointmentAPI.updateAppointment(appointment.appointmentId, {
        ...formData,
        scheduledAt: isoDate,
      });
  
      // 여기서 onUpdate 콜백을 호출하여 MobileCalendarPage의 fetchAppointments를 실행
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  return (
    <>
      <div
        className={`modal-overlay ${animationState}`}
        onClick={handleClose}
        onKeyDown={handleClose}
        role='button'
        tabIndex={0}
        aria-label='Close modal'
      />

      <div className={`appointment-modal ${animationState}`}>
        <div className='appointment-modal-content'>
          <h2>약속 수정</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='editScheduledAt'>날짜 및 시간</label>
              <input
                id='editScheduledAt'
                type='datetime-local'
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='editTitle'>제목</label>
              <input
                id='editTitle'
                type='text'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className='button-group'>
              <button type='submit'>수정</button>
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

EditAppointmentModal.propTypes = {
  appointment: PropTypes.shape({
    appointmentId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    scheduledAt: PropTypes.string.isRequired,
    opponentUserId: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditAppointmentModal;
