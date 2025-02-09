// src/components/common/SlideLayout.jsx

import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './SlideLayout.css';

const PANEL_WIDTH = '390px';

const SlideLayout = ({ isOpen, children, onClose }) => {
  const handleBodyStyles = useCallback(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.body.style.paddingRight = isOpen ? PANEL_WIDTH : '';
  }, [isOpen]);

  useEffect(() => {
    handleBodyStyles();
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [handleBodyStyles]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={`slide-layout ${isOpen ? 'slide-layout-open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div 
        className="slide-overlay"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close chat panel"
      />
      <div 
        className="slide-container"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

SlideLayout.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SlideLayout;