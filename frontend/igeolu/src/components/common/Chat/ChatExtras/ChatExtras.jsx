// src/components/common/Chat/ChatExtras/ChatExtras.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import liveIcon from '../../../../assets/images/liveButton.png';
import reservationIcon from '../../../../assets/images/reservationButton.png';
import attachIcon from '../../../../assets/images/fileAttatchButton.png';
import AppointmentModal from '../AppointmentModal/AppointmentModal';
import './ChatExtras.css';

const ChatExtras = ({ isOpen, room, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppointmentClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={`chat-extras ${isOpen ? 'open' : ''}`}>
      <div className="chat-extras-content">
        <button className="extra-button">
          <div className="icon-circle">
            <img src={liveIcon} alt="라이브" />
          </div>
          <span>라이브</span>
        </button>
        <button className="extra-button" onClick={handleAppointmentClick}>
          <div className="icon-circle">
            <img src={reservationIcon} alt="예약" />
          </div>
          <span>예약</span>
        </button>
        <button className="extra-button">
          <div className="icon-circle">
            <img src={attachIcon} alt="첨부" />
          </div>
          <span>첨부</span>
        </button>
      </div>

      {isModalOpen && (
        <AppointmentModal 
          onClose={() => setIsModalOpen(false)}
          roomInfo={room}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

ChatExtras.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  room: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired
};

export default ChatExtras;