import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { appointmentAPI } from '../../../../services/AppointmentApi';
import './AppointmentModal.css';

const AppointmentModal = ({ onClose, roomInfo, currentUserId, sendSystemMessage }) => {
  const [animationState, setAnimationState] = useState('entering');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    scheduledAt: '',
    title: '',
    memberId: roomInfo.userId,
    chatRoomId: roomInfo.roomId,
    appointmentType: "LIVE",
  });

  // 현재 시각의 ISO string을 생성하고 초 단위를 00으로 설정
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    
    // 브라우저의 datetime-local input이 기대하는 형식으로 변환
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

  const validateDateTime = (dateTimeStr) => {
    // datetime-local의 값은 이미 사용자의 로컬 시간대로 들어옴
    const selectedDate = new Date(dateTimeStr);
    const now = new Date();
    
    // 현재 시간과의 차이를 분 단위로 계산
    const diffInMinutes = (selectedDate - now) / (1000 * 60);
    
    // 현재 시간보다 미래이면서 1분 이상 차이나는지 확인
    return diffInMinutes > 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 선택된 시각이 현재보다 과거인지 확인
    if (!validateDateTime(formData.scheduledAt)) {
      setError('현재 시간보다 1분 이상 이후의 시간을 선택해주세요.');
      return;
    }

    try {
      // 수정된 부분: 타임존 오프셋을 고려한 ISO 문자열 변환
      const localDate = new Date(formData.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const isoDate = new Date(localDate.getTime() - offset).toISOString();
  
      const response = await appointmentAPI.createAppointment({
        ...formData,
        scheduledAt: isoDate,
      });
  
      console.log('Create appointment response:', response.data);
  
      // 시스템 메시지용 날짜 포맷팅
      const appointmentDate = new Date(formData.scheduledAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
        
      const systemMessage = `새로운 약속이 생성되었습니다.\n일시: ${appointmentDate}\n제목: ${formData.title}`;
      await sendSystemMessage(systemMessage);

      const newAppointment = {
        appointmentId: response.data.appointmentId,
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
      setError('약속 생성에 실패했습니다. 다시 시도해주세요.');
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
            {error && <div className="error-message">{error}</div>}
            <div className='appointment-form-group'>
              <label htmlFor='scheduledAt'>날짜 및 시간</label>
              <input
                type='datetime-local'
                id='scheduledAt'
                value={formData.scheduledAt}
                min={getCurrentDateTime()}
                onChange={(e) => {
                  setFormData({ ...formData, scheduledAt: e.target.value });
                  setError(''); // 새로운 시간 선택 시 에러 메시지 초기화
                }}
                required
              />
            </div>
            <div className='appointment-form-group'>
              <label htmlFor='title'>제목</label>
              <input
                type='text'
                id='title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className='appointment-form-group checkbox-group'>
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