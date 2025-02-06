import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MobileCalendarPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import { appointmentAPI } from '../../services/Axios';

function MobileCalendarPage() {
  const [value, setValue] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [slideStates, setSlideStates] = useState({});

  const handleTouchStart = (id, e) => {
    const touch = e.touches[0];
    setSlideStates((prev) => ({
      ...prev,
      [id]: { startX: touch.clientX },
    }));
  };

  // 삭제와 수정 함수 추가
const handleEdit = async (appointmentId) => {
    try {
      // 수정 페이지로 이동 또는 수정 모달 표시
      navigate(`/calendar/edit/${appointmentId}`);
    } catch (error) {
      console.error('Failed to edit appointment:', error);
    }
   };
   
   const handleDelete = async (appointmentId) => {
    try {
      await appointmentAPI.deleteAppointment(appointmentId);
      fetchAppointments(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
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
    const currentX = parseInt(scheduleItem.style.transform.replace('translateX(-', ''));
  
    const finalTransform = currentX > 80 ? 'translateX(-160px)' : 'translateX(0)';
    scheduleItem.style.transform = finalTransform;
    actions.style.transform = finalTransform;
  
    setSlideStates((prev) => ({
      ...prev,
      [id]: { startX: null },
    }));
  };

  // 임시 로그인 아이디디
  const userId = 1;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAppointments(userId);
      console.log(
        'Response type:',
        typeof response.data,
        Array.isArray(response.data)
      );
      console.log('Raw response:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.scheduledAt);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
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
                      <button className='edit-btn'>수정</button>
                      <button className='delete-btn'>삭제</button>
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
    </div>
  );
}

export default MobileCalendarPage;
