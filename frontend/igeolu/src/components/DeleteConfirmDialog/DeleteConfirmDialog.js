// src/components/DeleteConfirmDialog/DeleteConfirmDialog.js
import React from 'react';
import './DeleteConfirmDialog.css';

function DeleteConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="delete-dialog-overlay">
      <div className="delete-dialog">
        <h2 className="delete-dialog-title">일정 삭제</h2>
        <p className="delete-dialog-description">정말 해당 일정을 삭제하시겠습니까?</p>
        <div className="delete-dialog-buttons">
          <button 
            className="delete-dialog-cancel" 
            onClick={onCancel}
          >
            아니오
          </button>
          <button 
            className="delete-dialog-confirm" 
            onClick={onConfirm}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;