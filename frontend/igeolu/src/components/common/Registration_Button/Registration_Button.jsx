import React from 'react';
import './Registration_Button.css';


const Registration_Button = ({ onClick, children }) => {
    return (
        <button className="RegistrationButton" onClick={onClick}>
            {children}
        </button>
    );
};

export default Registration_Button;