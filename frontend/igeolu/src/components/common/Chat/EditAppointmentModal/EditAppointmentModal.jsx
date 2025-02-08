import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import { useAppointment } from '../../../../contexts/AppointmentContext';
import './EditAppointmentModal.css';

const EditAppointmentModal = ({ appointment, onClose }) => {
  const { updateAppointment } = useAppointment();
  const [formData, setFormData] = useState({
    scheduledAt: appointment.scheduledAt,
    title: appointment.title,
    userId: appointment.userId,
    opponentUserId: appointment.opponentUserId,
  });

  useEffect(() => {
    // 컴포넌트가 마운트되거나 appointment가 변경될 때 formData 업데이트
    const date = new Date(appointment.scheduledAt);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setFormData((prev) => ({
      scheduledAt: localDate,
      title: appointment.title,
      userId: appointment.userId, // userId 명시적 업데이트
    }));
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();

      console.log('Updating appointment with data:', {
        // 디버깅용 로그
        ...formData,
        scheduledAt: isoDate,
      });

      await appointmentAPI.updateAppointment(appointment.appointmentId, {
        ...formData,
        scheduledAt: isoDate,
      });

      updateAppointment(appointment.appointmentId, {
        ...formData,
        scheduledAt: isoDate,
      });

      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  return (
    <div className='appointment-modal'>
      <div className='modal-content'>
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
            <button type='button' onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditAppointmentModal.propTypes = {
  appointment: PropTypes.shape({
    appointmentId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    scheduledAt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditAppointmentModal;
