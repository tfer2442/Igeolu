import { useState, useEffect } from 'react';
import './WorldCup.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function WorldCup({ properties = [], isOpen, onClose, onSelectWinner }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [round, setRound] = useState(16); // 16강, 8강, 4강, 결승
    const [candidates, setCandidates] = useState([]); // 현재 라운드의 후보들
    const [winners, setWinners] = useState([]); // 각 라운드의 승자들
    const [winner, setWinner] = useState(null);  // 최종 우승자 상태 추가

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

        // 가장 가까운 2의 배수로 라운드 결정
        if (propertyCount <= 2) {
            initialRound = 2;
        } else if (propertyCount <= 4) {
            initialRound = 4;
        } else if (propertyCount <= 8) {
            initialRound = 8;
        } else {
            initialRound = 16;
        }

        // 실제 필요한 매물 수 (라운드에 맞춰서)
        const neededCount = Math.min(initialRound, Math.pow(2, Math.floor(Math.log2(propertyCount))));

        // 매물 섞기
        const shuffled = [...properties].sort(() => Math.random() - 0.5);
        
        // 필요한 개수만큼만 매물 선택 (초과하는 매물은 제외)
        const selectedProperties = shuffled.slice(0, neededCount);

        // 필요한 개수만큼 배열 채우기 (부족한 경우 부전승으로 채움)
        const initial = [...selectedProperties];
        while (initial.length < neededCount) {
            initial.push({
                propertyId: `dummy_${initial.length}`,
                images: [],
                deposit: 0,
                monthlyRent: 0,
                address: '부전승',
                description: '부전승',
                isDummy: true
            });
        }

        console.log(`Starting WorldCup with ${neededCount} properties in ${initialRound}강`);
        setCandidates(initial);
        setRound(initialRound);
        setWinners([]);
        setWinner(null);
    };

    const selectWinner = (selectedProperty) => {
        // 부전승 처리: 상대가 부전승인 경우 자동으로 다른 매물 선택
        const currentPair = candidates.slice(0, 2);
        let winningProperty = selectedProperty;

        if (currentPair.some(p => p.isDummy)) {
            winningProperty = currentPair.find(p => !p.isDummy) || selectedProperty;
        }

        const newWinners = [...winners, winningProperty];
        
        if (round === 2) {
            setWinner(winningProperty);
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
                이상집 월드컵
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
                                        <h3>🏆 우승 매물 🏆</h3>
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
                                            <p style={{fontSize: '14px'}}>{winner.description || '소개 정보 없음'}</p>
                                        </div>
                                        {/* <button 
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
                                        </button> */}

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
                                                className={`room-option ${property.isDummy ? 'room-option--dummy' : ''}`}
                                                key={property.propertyId}
                                                onClick={() => !property.isDummy && selectWinner(property)}
                                                style={{ 
                                                    cursor: property.isDummy ? 'default' : 'pointer',
                                                    opacity: property.isDummy ? 0.5 : 1 
                                                }}
                                            >
                                                {property.isDummy ? (
                                                    <div className="room-option__dummy">
                                                        <p>부전승</p>
                                                    </div>
                                                ) : (
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
                                                )}
                                                <p style={{fontSize: '20px', marginTop: '30px',fontWeight: 'bold'}}>{(property.deposit ?? 0).toLocaleString()} / {(property.monthlyRent ?? 0).toLocaleString()}</p>
                                                <p style={{fontSize: '14px'}}>{property.address || '주소 정보 없음'}</p>
                                                <p style={{fontSize: '14px'}}>{property.description || '소개 정보 없음'}</p>
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