import React, { useState } from 'react';
import { appointmentAPI } from '../../../../services/Axios';
import './AppointmentModal.css';

const AppointmentModal = ({ onClose, roomInfo, currentUserId }) => {
  const [formData, setFormData] = useState({
    scheduledAt: '',
    title: '',
    userId: currentUserId,
    opponentUserId: roomInfo.userId,
    chatRoomId: roomInfo.roomId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();
   
      const response = await appointmentAPI.createAppointment({
        ...formData,
        scheduledAt: isoDate
      });
   
      const newAppointment = {
        appointmentId: response.data.appointmentId,
        ...formData,
        scheduledAt: isoDate
      };
      onUpdate(newAppointment); // 부모 컴포넌트에서 appointments 상태 업데이트
      onClose();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
   };

  return (
    <div className="appointment-modal">
      <div className="modal-content">
        <h2>약속 생성</h2>
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
            <button type="submit">생성</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;