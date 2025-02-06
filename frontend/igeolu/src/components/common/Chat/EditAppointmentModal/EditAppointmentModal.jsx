// components/EditAppointmentModal/EditAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../../../services/Axios';
import './EditAppointmentModal.css';

const EditAppointmentModal = ({ appointment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    scheduledAt: '',
    title: appointment.title,
    userId: appointment.userId
  });

  useEffect(() => {
    const date = new Date(appointment.scheduledAt);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData(prev => ({ ...prev, scheduledAt: localDate }));
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();
      
      await appointmentAPI.updateAppointment(appointment.appointmentId, {
        ...formData,
        scheduledAt: isoDate
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  return (
    <div className="appointment-modal">
      <div className="modal-content">
        <h2>약속 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>날짜 및 시간</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">수정</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;