import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MobileCalendarPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import { appointmentAPI } from '../../services/Axios';

function MobileCalendarPage() {
  const [value, setValue] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const userId = 1; // 임시 나중에 로그인으로 대체
  // 상태 추가
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: '12',
    minute: '00',
  });

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

  const handleCreateAppointment = async () => {
    try {
        const scheduledAt = new Date(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
            parseInt(selectedTime.hour),
            parseInt(selectedTime.minute)
        ).toISOString();
 
        const appointmentData = {
            scheduledAt,
            title: "새 약속", // 나중에 입력받을 수 있도록 수정 가능
            userId: userId,
            opponentUserId: 0, // 필요한 값으로 수정
            chatRoomId: 0 // 필요한 값으로 수정
        };
 
        const response = await appointmentAPI.createAppointment(appointmentData);
        
        if (response.data.appointmentId) {
            fetchAppointments(); // 목록 갱신
            setShowTimePicker(false);
        }
    } catch (error) {
        console.error('Failed to create appointment:', error);
    }
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
              <button
                className='add-schedule-btn'
                onClick={() => setShowTimePicker(true)}
              >
                +
              </button>
            </div>

            {showTimePicker && (
              <div className='time-picker-modal'>
                <div className='time-picker'>
                  <input
                    type='number'
                    min='0'
                    max='23'
                    value={selectedTime.hour}
                    onChange={(e) =>
                      setSelectedTime({
                        ...selectedTime,
                        hour: e.target.value.padStart(2, '0'),
                      })
                    }
                  />
                  <span>:</span>
                  <input
                    type='number'
                    min='0'
                    max='59'
                    value={selectedTime.minute}
                    onChange={(e) =>
                      setSelectedTime({
                        ...selectedTime,
                        minute: e.target.value.padStart(2, '0'),
                      })
                    }
                  />
                </div>
                <div className='time-picker-buttons'>
                  <button onClick={() => setShowTimePicker(false)}>취소</button>
                  <button onClick={handleCreateAppointment}>확인</button>
                </div>
              </div>
            )}
            <div className='schedule-list'>
              {getAppointmentsForDate(value).length > 0 ? (
                getAppointmentsForDate(value).map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className='schedule-item'
                  >
                    <span className='schedule-time'>
                      {new Date(appointment.scheduledAt).toLocaleTimeString(
                        'ko-KR',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                    <span className='schedule-title'>{appointment.title}</span>
                    <span className='schedule-opponent'>
                      {appointment.opponentName}
                    </span>
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
