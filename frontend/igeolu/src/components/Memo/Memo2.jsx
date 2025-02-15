import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Memo2.css';
import axios from 'axios';

function Memo2({ sessionId, selectedMemoText, setSelectedMemoText }) {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [memosByProperty, setMemosByProperty] = useState({});

    // selectedMemoText가 변경될 때마다 메모 텍스트 업데이트
    useEffect(() => {
        if (selectedMemoText !== undefined) {
            setMemosByProperty(prev => ({
                ...prev,
                [selectedProperty?.livePropertyId]: selectedMemoText
            }));
        }
    }, [selectedMemoText, selectedProperty]);

    // 매물 목록 불러오기
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`/api/lives/${sessionId}/properties`);
                // livePropertyId 기준으로 정렬
                const sortedProperties = response.data.sort((a, b) => a.livePropertyId - b.livePropertyId);
                setProperties(sortedProperties);
                if (sortedProperties.length > 0) {
                    setSelectedProperty(sortedProperties[0]);  // 첫 번째 매물 자동 선택
                }
            } catch (error) {
                console.error('매물 목록 불러오기 실패:', error);
            }
        };

        if (sessionId) {
            fetchProperties();
        }
    }, [sessionId]);

    // 메모 저장 핸들러
    const handleSaveMemo = async () => {
        if (!selectedProperty) {
            alert('매물을 선택해주세요.');
            return;
        }

        try {
            await axios.put(`/api/live-properties/${selectedProperty.livePropertyId}/memo`, {
                memo: selectedMemoText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
                }
            });
            console.log('메모가 저장되었습니다.');
        } catch (error) {
            console.error('메모 저장 실패:', error);
            alert('메모 저장에 실패했습니다.');
        }
    };

    // 매물 선택 변경 핸들러
    const handlePropertyChange = (e) => {
        const selectedId = e.target.value;
        const property = properties.find(p => p.livePropertyId === parseInt(selectedId));
        setSelectedProperty(property);
        setSelectedMemoText(memosByProperty[selectedId] || '');
    };

    return (
        <div className='memo-container'>
            <div className='memo-title'>
                <select 
                    value={selectedProperty?.livePropertyId || ''} 
                    onChange={handlePropertyChange}
                    className='property-select'
                >
                    {properties.map(property => (
                        <option key={property.livePropertyId} value={property.livePropertyId}>
                            {property.address || '주소 없음'}
                        </option>
                    ))}
                </select>
            </div>
            <div className='memo-content'>
                <textarea
                    value={selectedMemoText || ''}
                    onChange={(e) => setSelectedMemoText(e.target.value)}
                    placeholder="메모를 입력하세요"
                    className='memo-textarea'
                />
            </div>
            <div className='memo-footer'>
                <button onClick={handleSaveMemo} className='save-button'>
                    저장
                </button>
            </div>
        </div>
    );
}

Memo2.propTypes = {
    sessionId: PropTypes.string.isRequired,
    selectedMemoText: PropTypes.string,
    setSelectedMemoText: PropTypes.func.isRequired
};

export default Memo2;
