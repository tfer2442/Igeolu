import React from 'react';
import './Back_Button.css';

const BackButton = ({ onClick }) => {
    return (
        <button className="BackButton" onClick={onClick}>
            ←
        </button>
    );
};

export default BackButton;
