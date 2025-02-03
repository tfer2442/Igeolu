import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MobileCalendarPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab'

function MobileCalendarPage() {
    const [value, setValue] = useState(new Date());
    // 임시 일정 데이터 추가 - UTC 대신 일반 Date 객체 사용
    const [schedules] = useState([
        {
            date: new Date(2025, 1, 15),
            title: '팀 미팅',
            time: '14:00'
        },
        {
            date: new Date(2025, 1, 15),
            title: '프로젝트 발표',
            time: '16:00'
        },
        {
            date: new Date(2025, 1, 20),
            title: '병원 예약',
            time: '10:30'
        }
    ]);

    // 선택된 날짜의 일정 필터링
    const getSchedulesForDate = (date) => {
        return schedules.filter(schedule => 
            schedule.date.getDate() === date.getDate() &&
            schedule.date.getMonth() === date.getMonth() &&
            schedule.date.getFullYear() === date.getFullYear()
        );
    }

    const onChange = (nextValue) => {
        setValue(nextValue);
        console.log('Selected date:', nextValue);
    }

    // 지난달 날짜 숨기기
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const firstDayOfMonth = new Date(value.getFullYear(), value.getMonth(), 1);
            return date < firstDayOfMonth;
        }
    }

    const formatShortWeekday = (locale, date) => {
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        return weekdays[date.getDay()];
    }

    // 날짜 표시 형식 수정
    const formatDay = (locale, date) => {
        return date.getDate().toString();
    }

    return (
        <div className="mobile-calendar-page-container">
            <div className="mobile-calendar-page">
                <div className="mobile-calendar-page__top">
                    <p>캘린더</p>
                </div>
                <div className="mobile-calendar-page__content">
                    <div className="mobile-calendar-page__calendar">
                        <Calendar
                            onChange={onChange}
                            value={value}
                            locale="ko-KR"
                            className="custom-calendar"
                            tileDisabled={tileDisabled}
                            showNeighboringMonth={false}
                            formatShortWeekday={formatShortWeekday}
                            formatDay={formatDay}
                        />
                    </div>
                    <div className="mobile-calendar-page__schedule">
                        <p id="schedule-date">{value.getMonth() + 1}월 {value.getDate()}일</p>
                        <div className="schedule-list">
                            {getSchedulesForDate(value).length > 0 ? (
                                getSchedulesForDate(value).map((schedule, index) => (
                                    <div key={index} className="schedule-item">
                                        <span className="schedule-time">{schedule.time}</span>
                                        <span className="schedule-title">{schedule.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-schedule">등록된 일정이 없습니다.</p>
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