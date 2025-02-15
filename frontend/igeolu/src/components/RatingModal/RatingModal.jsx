import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, sessionId }) => {
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    if (!isOpen) return null;

    const handleStarClick = (value) => {
        setRating(value);
    };

    const renderStars = () => {
        const stars = [];
        const maxStars = 5;

        for (let i = 1; i <= maxStars; i++) {
            const value = i;
            const halfValue = i - 0.5;
            const filled = rating >= value;
            const halfFilled = rating === halfValue;

            stars.push(
                <span
                    key={i}
                    className="rating-modal__star-container"
                >
                    <span
                        className="rating-modal__star-half-clickable rating-modal__star-half-clickable--left"
                        onClick={() => handleStarClick(halfValue)}
                    />
                    <span
                        className="rating-modal__star-half-clickable rating-modal__star-half-clickable--right"
                        onClick={() => handleStarClick(value)}
                    />
                    {filled ? (
                        <FaStar className="rating-modal__star" />
                    ) : halfFilled ? (
                        <FaStarHalfAlt className="rating-modal__star" />
                    ) : (
                        <FaRegStar className="rating-modal__star rating-modal__star--empty" />
                    )}
                </span>
            );
        }
        return stars;
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('평점을 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            
            // API 명세에 맞게 요청 데이터 구성
            const requestData = {
                liveId: sessionId,
                score: rating  // rating 대신 score 사용
            };
            console.log('Submitting rating with data:', requestData);
            
            // API 요청 정보 로깅
            console.log('Request headers:', {
                'Content-Type': 'application/json',
                'Authorization': axios.defaults.headers.common['Authorization']
            });
            
            // 평점 API 호출
            const response = await axios.post(`/api/lives/${sessionId}/rating`, requestData);

            console.log('Rating submission response:', response.data);

            alert('평가가 완료되었습니다.');
            onClose();
            window.location.href = '/';
        } catch (error) {
            console.error('Error submitting rating:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
                headers: error.response?.headers,
                requestData: error.config?.data
            });
            alert('평점 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-modal-overlay">
            <div className="rating-modal__container">
                <h2 className="rating-modal__title">라이브 평가하기</h2>
                <p className="rating-modal__subtitle">중개사님의 라이브는 어떠셨나요?</p>
                <div className="rating-modal__stars-container">
                    {renderStars()}
                </div>
                <p className="rating-modal__rating-value">{rating}점</p>
                <div className="rating-modal__buttons">
                    <button 
                        className="rating-modal__submit-button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '제출 중...' : '평가 완료'}
                    </button>
                    <button 
                        className="rating-modal__cancel-button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;