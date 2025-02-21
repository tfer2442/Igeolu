
import { useState, useEffect } from 'react';
import './WorldCup.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsTrophyFill } from 'react-icons/bs';

function WorldCup({ properties = [], isOpen, onClose, onSelectWinner }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [round, setRound] = useState(16);
    const [candidates, setCandidates] = useState([]);
    const [winners, setWinners] = useState([]);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (properties && properties.length >= 2) {
            const initialIndexes = {};
            properties.forEach(property => {
                if (property && property.propertyId) {
                    initialIndexes[property.propertyId] = 0;
                }
            });
            setCurrentImageIndexes(initialIndexes);
            initializeWorldCup(properties);
        }
    }, [properties]);

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

    const initializeWorldCup = (properties) => {
        if (!properties || properties.length < 2) return;

        const propertyCount = properties.length;
        let initialRound;

        // 매물 수에 따라 토너먼트 라운드 결정
        if (propertyCount >= 16) {
            initialRound = 16;
        } else if (propertyCount >= 8 && propertyCount <= 15) {
            initialRound = 8;
        } else if (propertyCount >= 4 && propertyCount <= 7) {
            initialRound = 4;
        } else {
            initialRound = 2;
        }

        // 매물을 무작위로 섞기
        const shuffledProperties = [...properties]
            .sort(() => Math.random() - 0.5)
            .slice(0, initialRound);

        console.log(`Starting WorldCup with ${shuffledProperties.length} properties in ${initialRound}강`);
        setCandidates(shuffledProperties);
        setRound(initialRound);
        setWinners([]);
        setWinner(null);
    };

    const selectWinner = (selectedProperty) => {
        const newWinners = [...winners, selectedProperty];
        
        if (round === 2) {
            setWinner(selectedProperty);
        } else {
            if (newWinners.length === round / 2) {
                const nextRound = round / 2;
                setRound(nextRound);
                setCandidates(newWinners);
                setWinners([]);
            } else {
                setWinners(newWinners);
                const remainingCandidates = candidates.slice(2);
                setCandidates(remainingCandidates);
            }
        }
    };

    const resetWorldCup = () => {
        setWinner(null);
        setRound(16);
        setCandidates([]);
        setWinners([]);
        initializeWorldCup(properties);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onClose();
        resetWorldCup();
    };

    const handleWorldCupClick = () => {
        if (properties.length < 2) {
            alert('월드컵을 시작하기 위해서는 최소 2개 이상의 매물이 필요합니다.');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className='world-cup'>
            <button 
                className={`world-cup__button ${properties.length < 2 ? 'world-cup__button--disabled' : ''}`}
                onClick={handleWorldCupClick}
                disabled={properties.length < 2}
            >
                <BsTrophyFill color="#FFD700" /> 이상집 월드컵
            </button>

            {isModalOpen && (
                <div className="world-cup-modal__overlay">
                    <div className="world-cup-modal">
                        <div className="world-cup-modal__container">   
                            <div className="world-cup-modal__header">
                                <div className="world-cup-modal__title">
                                    <h2>매물 월드컵 {round === 2 ? '결승' : `${round}강`}</h2>
                                    <div className="world-cup-modal__match-count">
                                        {!winner && `${Math.floor(winners.length + 1)}/${round/2} 매치`}
                                    </div>
                                </div>
                                <button 
                                    className="world-cup-modal__close-button" 
                                    onClick={handleCloseModal}
                                >
                                    X
                                </button>
                            </div>
                            <div className="world-cup-modal__content">
                                {winner ? (
                                    <div className="world-cup-modal__winner">
                                        <h3><BsTrophyFill color="#FFD700" /> 우승 매물 <BsTrophyFill color="#FFD700" /></h3>
                                        <div className="room-option">
                                            <div className="image-container">
                                                {winner.images && winner.images.length > 0 && (
                                                    <img 
                                                        src={winner.images[currentImageIndexes[winner.propertyId]]} 
                                                        alt="우승 매물" 
                                                    />
                                                )}
                                            </div>
                                            <p style={{fontSize: '20px', marginTop: '10px',fontWeight: 'bold'}}>{(winner.deposit ?? 0).toLocaleString()} / {(winner.monthlyRent ?? 0).toLocaleString()}</p>
                                            <p style={{fontSize: '14px'}}>{winner.address || '주소 정보 없음'}</p>
                                            <p style={{fontSize: '14px'}}>{winner.area}㎡ ({Math.floor(winner.area * 0.3025)}평) | {winner.currentFloor}층/{winner.totalFloors}층</p>
                                            <div style={{fontSize: '13px', color: '#666', marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center'}}>
                                                {winner.options && winner.options.map((option) => (
                                                    <span key={option.optionId} style={{
                                                        backgroundColor: '#f0f7ff',
                                                        color: '#01ADFF',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px'
                                                    }}>
                                                        {option.optionName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="winner-buttons-container">
                                            <button 
                                                className="world-cup-modal__restart-button" 
                                                onClick={resetWorldCup}
                                            >
                                                다시하기
                                            </button>
                                            <button
                                                className="world-cup-modal__property-button"
                                                onClick={() => {
                                                    onSelectWinner(winner);
                                                    handleCloseModal();
                                                }}
                                            >
                                                매물보기
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="world-cup-modal__vs-container">
                                        {candidates.slice(0, 2).map((property, index) => (
                                            <div 
                                                className="room-option"
                                                key={property.propertyId}
                                                onClick={() => selectWinner(property)}
                                            >
                                                <div className="image-container">
                                                    {property.images && property.images.length > 0 && (
                                                        <>
                                                            <img 
                                                                src={property.images[currentImageIndexes[property.propertyId]]} 
                                                                alt={`매물${index + 1}`} 
                                                            />
                                                            {property.images.length > 1 && (
                                                                <div className="image-controls">
                                                                    <button 
                                                                        className="image-control-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrevImage(
                                                                                property.propertyId, 
                                                                                property.images.length
                                                                            );
                                                                        }}
                                                                    >
                                                                        <IoIosArrowBack size={24} />
                                                                    </button>
                                                                    <button 
                                                                        className="image-control-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleNextImage(
                                                                                property.propertyId, 
                                                                                property.images.length
                                                                            );
                                                                        }}
                                                                    >
                                                                        <IoIosArrowForward size={24} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <p style={{fontSize: '20px', marginTop: '30px',fontWeight: 'bold'}}>{(property.deposit ?? 0).toLocaleString()} / {(property.monthlyRent ?? 0).toLocaleString()}</p>
                                                <p style={{fontSize: '14px'}}>{property.address || '주소 정보 없음'}</p>
                                                <p style={{fontSize: '14px'}}>{property.area}㎡ ({Math.floor(property.area * 0.3025)}평) | {property.currentFloor}층/{property.totalFloors}층</p>
                                                <div style={{fontSize: '13px', color: '#666', marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                                    {property.options && property.options.map((option) => (
                                                        <span key={option.optionId} style={{
                                                            backgroundColor: '#f0f7ff',
                                                            color: '#01ADFF',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px'
                                                        }}>
                                                            {option.optionName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="vs-text">VS</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorldCup;