import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import './EditAppointmentModal.css';

const EditAppointmentModal = ({ appointment, onClose, onUpdate }) => {
  const [animationState, setAnimationState] = useState('entering');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    scheduledAt: appointment.scheduledAt,
    title: appointment.title,
    userId: appointment.userId,
    opponentUserId: appointment.opponentUserId,
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const validateDateTime = (dateTimeStr) => {
    const selectedDate = new Date(dateTimeStr);
    const now = new Date();
    return selectedDate > now;
  };

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

    // 선택된 시각이 현재보다 과거인지 확인
    if (!validateDateTime(formData.scheduledAt)) {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setError(`${formatter.format(now)} 이후의 시간을 선택해주세요.`);
      return;
    }

    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();

      await appointmentAPI.updateAppointment(appointment.appointmentId, {
        ...formData,
        scheduledAt: isoDate,
      });
  
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      setError('약속 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

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
          <h2>약속 수정</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className='editappointment-form-group'>
              <label htmlFor='editScheduledAt'>날짜 및 시간</label>
              <input
                id='editScheduledAt'
                type='datetime-local'
                value={formData.scheduledAt}
                min={getCurrentDateTime()}
                onChange={(e) => {
                  setFormData({ ...formData, scheduledAt: e.target.value });
                  setError(''); // 새로운 시간 선택 시 에러 메시지 초기화
                }}
                required
              />
            </div>
            <div className='editappointment-form-group'>
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