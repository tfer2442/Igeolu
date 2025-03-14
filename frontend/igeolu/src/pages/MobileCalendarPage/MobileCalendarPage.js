// src/pages/MobileCalendarPage/MobileCalendarPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MobileCalendarPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import { appointmentAPI } from '../../services/AppointmentApi';
import EditAppointmentModal from '../../components/common/Chat/EditAppointmentModal/EditAppointmentModal';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import editIcon from '../../assets/images/reservationEdit.png';
import deleteIcon from '../../assets/images/reservationDelete.png';
import MobileTopBar from '../../components/MobileTopBar/MobileTopBar';

function MobileCalendarPage() {
  const [value, setValue] = useState(new Date());
  const [slideStates, setSlideStates] = useState({});
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const appointmentRefs = useRef({});

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;

  const groupAppointmentsByDate = useCallback((appointments) => {
    const grouped = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.scheduledAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(appointment);
      return acc;
    }, {});

    const sortedKeys = Object.keys(grouped).sort();
    const sortedGrouped = {};
    sortedKeys.forEach((key) => {
      sortedGrouped[key] = grouped[key].sort(
        (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
      );
    });

    return sortedGrouped;
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!userId) {
      console.log('No userId found');
      return;
    }

    try {
      const response = await appointmentAPI.getAppointments();
      const formattedAppointments = response.data.map((appointment) => ({
        appointmentId: appointment.id || appointment.appointmentId,
        scheduledAt: appointment.scheduledAt,
        memberName: appointment.memberName,
        title: appointment.title,
        appointmentType: appointment.appointmentType,
      }));
      setGroupedAppointments(groupAppointmentsByDate(formattedAppointments));
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, [userId, groupAppointmentsByDate]);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId, fetchAppointments]);

  // 오늘 날짜 또는 가장 가까운 날짜로 스크롤하는 효과
  useEffect(() => {
    if (Object.keys(groupedAppointments).length === 0) return;

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 모든 날짜 키를 가져와서 정렬
    const dateKeys = Object.keys(groupedAppointments).sort();

    // 오늘 날짜에 일정이 있는 경우
    if (appointmentRefs.current[todayKey]) {
      scrollToElement(appointmentRefs.current[todayKey]);
      return;
    }

    // 오늘 이후의 가장 가까운 날짜 찾기
    const futureDate = dateKeys.find((dateKey) => dateKey > todayKey);
    if (futureDate && appointmentRefs.current[futureDate]) {
      scrollToElement(appointmentRefs.current[futureDate]);
    }
  }, [groupedAppointments]);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId, fetchAppointments]);

  const scrollToElement = (element, duration = 500) => {
    if (!element) return;

    const scheduleContainer = document.querySelector(
      '.mobile-calendar-page__schedule'
    );
    const startPosition = scheduleContainer.scrollTop;
    const targetPosition =
      element.getBoundingClientRect().top +
      scheduleContainer.scrollTop -
      scheduleContainer.getBoundingClientRect().top;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      scheduleContainer.scrollTop = startPosition + distance * ease;

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const onChange = (nextValue) => {
    setValue(nextValue);
    const dateKey = `${nextValue.getFullYear()}-${String(nextValue.getMonth() + 1).padStart(2, '0')}-${String(nextValue.getDate()).padStart(2, '0')}`;
    if (appointmentRefs.current[dateKey]) {
      scrollToElement(appointmentRefs.current[dateKey]);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete?.appointmentId) return;

    try {
      await appointmentAPI.deleteAppointment(appointmentToDelete.appointmentId);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    } finally {
      setShowDeleteConfirm(false);
      setAppointmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
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
    const slideX = Math.max(Math.min(diff, 205), 0);

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
      currentX > 80 ? 'translateX(-200px)' : 'translateX(0)';
    scheduleItem.style.transform = finalTransform;
    actions.style.transform = finalTransform;

    setSlideStates((prev) => ({
      ...prev,
      [id]: { startX: null },
    }));
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const hasAppointment = groupedAppointments[dateKey]?.length > 0;

      return hasAppointment ? (
        <div className='dot-container'>
          <div className='appointment-dot' />
        </div>
      ) : null;
    }
  };

  return (
    <div className='mobile-calendar-page-container'>
      <div className='mobile-calendar-page'>
        <MobileTopBar title='캘린더' />
        <div className='mobile-calendar-page__content'>
          <div className='mobile-calendar-page__calendar'>
            <Calendar
              onChange={onChange}
              value={value}
              locale='ko-KR'
              className='custom-calendar'
              showNeighboringMonth={false}
              formatShortWeekday={(locale, date) =>
                ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
              }
              formatDay={(locale, date) => date.getDate().toString()}
              tileContent={tileContent}
            />
          </div>
          <div className='mobile-calendar-page__schedule'>
            {Object.entries(groupedAppointments).map(
              ([dateKey, dateAppointments]) => (
                <div
                  key={dateKey}
                  ref={(el) => (appointmentRefs.current[dateKey] = el)}
                  className='date-group'
                >
                  <div className='schedule-header'>
                    <p id='schedule-date'>
                      {new Date(dateKey).getMonth() + 1}월{' '}
                      {new Date(dateKey).getDate()}일
                    </p>
                  </div>
                  <div className='schedule-list'>
                    {dateAppointments.map((appointment) => (
                      <div
                        key={appointment.appointmentId}
                        className='schedule-item-container'
                      >
                        <div
                          className={`schedule-item ${
                            appointment.appointmentType === 'LIVE'
                              ? 'type-live'
                              : 'type-common'
                          }`}
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
                          <div className='schedule-info'>
                            <div className='schedule-main'>
                              <span className='schedule-opponent'>
                                {appointment.memberName}님
                              </span>
                              <span className='schedule-time'>
                                {new Date(
                                  appointment.scheduledAt
                                ).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className='schedule-title'>
                              {appointment.title}
                            </div>
                          </div>
                        </div>
                        <div className='schedule-actions'>
                          <button
                            className='edit-btn'
                            onClick={() => handleEdit(appointment)}
                          >
                            <img
                              src={editIcon}
                              alt='수정'
                              className='action-icon'
                            />
                            <span>수정</span>
                          </button>
                          <button
                            className='delete-btn'
                            onClick={() => handleDeleteClick(appointment)}
                          >
                            <img
                              src={deleteIcon}
                              alt='삭제'
                              className='action-icon'
                            />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            {Object.keys(groupedAppointments).length === 0 && (
              <p className='no-schedule'>등록된 일정이 없습니다.</p>
            )}
          </div>
        </div>

        {showDeleteConfirm && (
          <DeleteConfirmDialog
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

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
