// src/pages/MobileCalendarPage/MobileCalendarPage.js
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MobileCalendarPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import { appointmentAPI } from '../../services/Axios';
import EditAppointmentModal from '../../components/common/Chat/EditAppointmentModal/EditAppointmentModal';
import { useAppointment } from '../../contexts/AppointmentContext';

function MobileCalendarPage() {
  const [value, setValue] = useState(new Date());
  const { appointments, setAppointments, deleteAppointment} = useAppointment();
  const [slideStates, setSlideStates] = useState({});
  const [editingAppointment, setEditingAppointment] = useState(null);
  // userId 가져오는 부분 수정
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;
  

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleDelete = async (appointmentId) => {
    if (!appointmentId) {
      console.error('Error: appointmentId is undefined');
      return;
    }
    
    try {
      console.log('Deleting appointment with ID:', appointmentId); // 디버깅용 로그
      await appointmentAPI.deleteAppointment(appointmentId);
      deleteAppointment(appointmentId);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const handleTouchStart = (id, e) => {
    const touch = e.touches[0];
    setSlideStates((prev) => ({
      ...prev,
      [id]: { startX: touch.clientX },
    }));
  };

  const handleTouchMove = (id, e) => {
    const startX = slideStates[id]?.startX;
    if (!startX) return;

    const diff = startX - e.touches[0].clientX;
    const slideX = Math.max(Math.min(diff, 160), 0);

    const container = e.currentTarget.parentElement;
    const scheduleItem = e.currentTarget;
    const actions = container.querySelector('.schedule-actions');

    scheduleItem.style.transform = `translateX(-${slideX}px)`;
    actions.style.transform = `translateX(-${slideX}px)`;
  };

  const handleTouchEnd = (id, e) => {
    const container = e.currentTarget.parentElement;
    const scheduleItem = e.currentTarget;
    const actions = container.querySelector('.schedule-actions');
    const currentX = parseInt(
      scheduleItem.style.transform.replace('translateX(-', '')
    );

    const finalTransform =
      currentX > 80 ? 'translateX(-160px)' : 'translateX(0)';
    scheduleItem.style.transform = finalTransform;
    actions.style.transform = finalTransform;

    setSlideStates((prev) => ({
      ...prev,
      [id]: { startX: null },
    }));
  };

  

  // fetchAppointments를 useCallback으로 감싸기
  const fetchAppointments = useCallback(async () => {
    if (!userId) {
      console.log('No userId found');
      return;
    }
    
    try {
      console.log('Making API call for userId:', userId);
      const response = await appointmentAPI.getAppointments(userId);
      console.log('API Response data structure:', response.data); // 여기서 데이터 구조 확인
      
      // 데이터 구조 변환이 필요할 수 있음
      const formattedAppointments = response.data.map(appointment => {
        console.log('Individual appointment from API:', appointment); // 각 약속 데이터 확인
        return {
          appointmentId: appointment.id || appointment.appointmentId, // API 응답에 따라 적절한 필드 선택
          scheduledAt: appointment.scheduledAt,
          opponentName: appointment.opponentName,
          title: appointment.title
        };
      });
      
      console.log('Formatted appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, [userId, setAppointments]);

useEffect(() => {
  if (userId) {
    console.log('Fetching appointments for user:', userId);
    fetchAppointments();
  }
}, [userId, fetchAppointments]);

  const getAppointmentsForDate = (date) => {
    console.log('All appointments:', appointments); // 전체 약속 데이터 확인
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  });
  console.log('Filtered appointments:', filteredAppointments); // 필터링된 약속 확인
  return filteredAppointments;
};

  const onChange = (nextValue) => {
    setValue(nextValue);
    console.log('Selected date:', nextValue);
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const firstDayOfMonth = new Date(
        value.getFullYear(),
        value.getMonth(),
        1
      );
      return date < firstDayOfMonth;
    }
    return false;
  };

  const formatShortWeekday = (locale, date) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  };

  const formatDay = (locale, date) => {
    return date.getDate().toString();
  };

  return (
    <div className='mobile-calendar-page-container'>
      <div className='mobile-calendar-page'>
        <div className='mobile-calendar-page__top'>
          <p>캘린더</p>
        </div>
        <div className='mobile-calendar-page__content'>
          <div className='mobile-calendar-page__calendar'>
            <Calendar
              onChange={onChange}
              value={value}
              locale='ko-KR'
              className='custom-calendar'
              tileDisabled={tileDisabled}
              showNeighboringMonth={false}
              formatShortWeekday={formatShortWeekday}
              formatDay={formatDay}
            />
          </div>
          <div className='mobile-calendar-page__schedule'>
            <div className='schedule-header'>
              <p id='schedule-date'>
                {value.getMonth() + 1}월 {value.getDate()}일
              </p>
            </div>
            <div className='schedule-list'>
              {getAppointmentsForDate(value).length > 0 ? (
                getAppointmentsForDate(value).map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className='schedule-item-container'
                  >
                    <div
                      className='schedule-item'
                      onTouchStart={(e) =>
                        handleTouchStart(appointment.appointmentId, e)
                      }
                      onTouchMove={(e) =>
                        handleTouchMove(appointment.appointmentId, e)
                      }
                      onTouchEnd={(e) =>
                        handleTouchEnd(appointment.appointmentId, e)
                      }
                    >
                      <span className='schedule-opponent'>
                        {appointment.opponentName}님
                      </span>
                      <span className='schedule-time'>
                        {new Date(appointment.scheduledAt).toLocaleTimeString(
                          'ko-KR',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    </div>
                    <div className='schedule-actions'>
                      <button
                        className='edit-btn'
                        onClick={() => handleEdit(appointment)}
                      >
                        수정
                      </button>
                      <button
                        className='delete-btn'
                        onClick={() => handleDelete(appointment.appointmentId)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='no-schedule'>등록된 일정이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        <MobileBottomTab />
      </div>
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onUpdate={fetchAppointments}
        />
      )}
    </div>
  );
}

export default MobileCalendarPage;
