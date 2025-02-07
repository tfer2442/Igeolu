import React from 'react';
import axios from 'axios';
import './DeleteButton.css';

const DeleteButton = ({ propertyId, onDeleteSuccess, className }) => {
    const handleDelete = async () => {
        if (!window.confirm('거래완료 처리하시겠습니까?')) {
            return;
        }

        try {
            console.log('거래완료 처리 요청 - 매물 ID:', propertyId);
            
            const { data } = await axios.delete(
                `http://192.168.0.4:3000/api/properties/${propertyId}`,
                {
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                    }
                }
            );

            console.log('거래완료 처리 응답:', data);

            if (data.statusCode === 200) {
                alert("거래완료 처리되었습니다!");
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || '처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <button 
            className={`delete-button ${className || ''}`}
            onClick={handleDelete}
        >
            거래완료
        </button>
    );
};

export default DeleteButton;