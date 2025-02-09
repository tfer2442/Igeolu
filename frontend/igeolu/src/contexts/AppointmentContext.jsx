// contexts/AppointmentContext.jsx
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  AppointmentProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };


  const addAppointment = (newAppointment) => {
    console.log('Adding appointment to context:', newAppointment); // 디버깅용 로그
    if (!newAppointment.appointmentId) {
      console.error('Warning: Attempting to add appointment without appointmentId:', newAppointment);
      return;
    }
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (appointmentId, updatedData) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.appointmentId === appointmentId 
        ? { ...appointment, ...updatedData }
        : appointment
    ));
  };

  const deleteAppointment = (appointmentId) => {
    console.log('Deleting appointment with ID:', appointmentId); // 디버깅용 로그
    if (!appointmentId) {
      console.error('Warning: Attempting to delete appointment with undefined appointmentId');
      return;
    }
    setAppointments(prev => 
      prev.filter(appointment => appointment.appointmentId !== appointmentId)
    );
  };

  return (
    <AppointmentContext.Provider 
      value={{ 
        appointments,
        setAppointments, 
        addAppointment, 
        updateAppointment, 
        deleteAppointment 
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

