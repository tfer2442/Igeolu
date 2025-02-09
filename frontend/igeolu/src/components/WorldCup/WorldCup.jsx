import { useState, useEffect } from 'react';
import './WorldCup.css';

function WorldCup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [properties, setProperties] = useState([]);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const userId = 1; // 테스트용 userId

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`/api/properties?userId=${userId}`);
                const data = await response.json();
                setProperties(data);
                // 각 매물의 이미지 인덱스 초기화
                const initialIndexes = {};
                data.forEach(property => {
                    initialIndexes[property.propertyId] = 0;
                });
                setCurrentImageIndexes(initialIndexes);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handleNextImage = (propertyId, imagesLength) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [propertyId]: (prev[propertyId] + 1) % imagesLength
        }));
    };

    const handlePrevImage = (propertyId, imagesLength) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [propertyId]: (prev[propertyId] - 1 + imagesLength) % imagesLength
        }));
    };

    return (
        <div className='world-cup'>
            <button 
                className='world-cup__button'
                onClick={() => setIsModalOpen(true)}
            >
                이상집 월드컵
            </button>

            {isModalOpen && properties.length >= 2 && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-container">   
                            <div className="modal-header">
                                <p style={{color: '#959595', fontSize: '24px', margin: '0'}}>내 조건에 따른</p>
                                <p style={{color: 'black', fontSize: '36px' ,fontWeight: 'bold', margin: '0'}}>매물 월드컵</p>
                                <span style={{color: '#2C76FF', fontSize: '24px'}}>16강</span>
                            </div>
                       
                            <div className="modal-content">
                                <div className="vs-container">
                                    {[0, 1].map((index) => (
                                        <div className="room-option" key={index}>
                                            <div className="image-container">
                                                {properties[index].images && properties[index].images.length > 0 && (
                                                    <>
                                                        <img 
                                                            src={properties[index].images[currentImageIndexes[properties[index].propertyId]]} 
                                                            alt={`매물${index + 1}`} 
                                                        />
                                                        {properties[index].images.length > 1 && (
                                                            <div className="image-controls">
                                                                <button onClick={() => handlePrevImage(
                                                                    properties[index].propertyId, 
                                                                    properties[index].images.length
                                                                )}>←</button>
                                                                <button onClick={() => handleNextImage(
                                                                    properties[index].propertyId, 
                                                                    properties[index].images.length
                                                                )}>→</button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <p>{(properties[index].deposit ?? 0).toLocaleString()}원 / {(properties[index].monthlyRent ?? 0).toLocaleString()}원</p>
                                            <p>{properties[index].address || '주소 정보 없음'}</p>
                                            <p>{properties[index].description || '소개 정보 없음'}</p>
                                        </div>
                                    ))}
                                    <div className="vs-text">VS</div>
                                </div>
                            </div>
                            <button className="close-button" onClick={() => setIsModalOpen(false)}>
                                X
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorldCup;