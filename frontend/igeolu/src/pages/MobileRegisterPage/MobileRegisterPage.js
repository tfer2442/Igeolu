// src/pages/MobileRegisterPage/MobileRegisterPage.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowBack, IoIosCamera, IoMdClose } from 'react-icons/io';
import './MobileRegisterPage.css';
import MobileBottomTab from '../../components/MobileBottomTab/MobileBottomTab';
import AdditionalInfoAPI from '../../services/AdditionalInfoApi';

function MobileRegisterPage() {
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [description, setDescription] = useState('');
    const [deposit, setDeposit] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [area, setArea] = useState('');
    const [approvalDate, setApprovalDate] = useState('');
    const [currentFloor, setCurrentFloor] = useState('');
    const [totalFloors, setTotalFloors] = useState('');
    const [address, setAddress] = useState('');
    const [optionsList, setOptionsList] = useState([]);
    const [addressKeyword, setAddressKeyword] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: '', y: '', dongcode: '' });
    const [imageFiles, setImageFiles] = useState([]);

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // 실제 파일 저장
        setImageFiles(prev => [...prev, ...files]);
        // 미리보기용 URL 생성
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...imageUrls]);
    };

    const handleDeleteImage = (indexToDelete) => {
        setImages(images.filter((_, index) => index !== indexToDelete));
        setImageFiles(imageFiles.filter((_, index) => index !== indexToDelete));
    };

    // 주소 검색 함수
    const searchAddress = async () => {
        if (!addressKeyword.trim()) return;
        
        setIsSearching(true);
        setSearchError(null);
        
        try {
            const response = await AdditionalInfoAPI.searchAddress(addressKeyword);
            
            if (response.results?.common?.errorCode === '0') {
                setAddressResults(response.results.juso || []);
                setShowResults(true);
            } else {
                throw new Error(response.results?.common?.errorMessage || '주소 검색에 실패했습니다.');
            }
        } catch (err) {
            setSearchError(err.message);
            setAddressResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // 좌표 조회 함수
    const getCoordinates = async (admCd, rnMgtSn, udrtYn, buldMnnm, buldSlno) => {
        try {
            const response = await AdditionalInfoAPI.getCoordinates({
                admCd,
                rnMgtSn,
                udrtYn,
                buldMnnm,
                buldSlno
            });
            
            if (response.results?.common?.errorCode === '0') {
                const coordInfo = response.results.juso[0];
                return {
                    entX: coordInfo.entX,
                    entY: coordInfo.entY
                };
            }
            throw new Error('좌표를 찾을 수 없습니다.');
        } catch (error) {
            console.error('좌표 변환 실패:', error);
            return null;
        }
    };

    // 주소 선택 처리 함수
    const handleAddressSelect = async (result) => {
        try {
            const coords = await getCoordinates(
                result.admCd,
                result.rnMgtSn,
                result.udrtYn,
                result.buldMnnm,
                result.buldSlno
            );
            
            setAddress(result.roadAddr);
            setCoordinates({
                x: coords?.entX || 0,
                y: coords?.entY || 0,
                dongcode: result.admCd
            });
            
            setShowResults(false);
            setAddressKeyword('');
        } catch (error) {
            console.error('주소 선택 처리 실패:', error);
            setCoordinates({
                x: 0,
                y: 0,
                dongcode: result.admCd
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // JSON 데이터 구성
            const propertyData = {
                userId: 32,
                description: description,
                deposit: parseInt(deposit),
                monthlyRent: parseInt(monthlyRent),
                area: parseFloat(area),
                approvalDate: approvalDate,
                currentFloor: parseInt(currentFloor),
                totalFloors: parseInt(totalFloors),
                address: address,
                y: coordinates.y,
                x: coordinates.x,
                dongcode: coordinates.dongcode,
                options: selectedOptions
            };
    
            console.log('JSON 데이터:', propertyData);  // JSON 데이터 확인
    
            // FormData 생성
            const formData = new FormData();
    
            // JSON 데이터를 Blob 형태로 추가
            formData.append(
                "propertyPostRequestDto",
                new Blob([JSON.stringify(propertyData)], { type: "application/json" })
            );
    
            // 선택된 이미지 파일들 추가
            imageFiles.forEach((file) => {
                formData.append('images', file);
            });
    
            // FormData 내용 확인
            console.log('========= FormData 내용 =========');
            for (let [key, value] of formData.entries()) {
                if (key === 'propertyPostRequestDto') {
                    console.log('propertyPostRequestDto:', JSON.parse(await value.text()));
                } else {
                    console.log(`${key}:`, value);
                }
            }
            console.log('===============================');
    
            console.log('이미지 파일 정보:');
            imageFiles.forEach((file, index) => {
                console.log(`이미지 ${index + 1}:`, {
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
            });
    
            // axios instance 생성
        const axiosInstance = axios.create({
            baseURL: 'https://i12d205.p.ssafy.io/api',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMyLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAyOTM4LCJleHAiOjE3NDAxMTI1Mzh9.nE5i5y2LWQR8Cws172k0Ti15LumNkDd0uihFYHQdnUg'
            }
        });

        const response = await axiosInstance.post('/properties', formData);
            
            if (response.status === 200 || response.status === 201) {
                alert('매물이 성공적으로 등록되었습니다.');
                window.history.back();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('매물 등록에 실패했습니다.');
        }
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('/api/options');
                console.log('옵션 목록 응답:', response.data);
                setOptionsList(response.data);
            } catch (error) {
                console.error('옵션 목록을 불러오는데 실패했습니다:', error);
            }
        };

        fetchOptions();
    }, []);

    return (
        <div className="mobile-register-page-container">
            <div className="mobile-register-page">
                <div className="mobile-register-page__top-bar">
                    <IoIosArrowBack
                        className="back-button"
                        onClick={() => window.history.back()}
                        size={24}
                    />
                </div>
                <p className="mobile-register-page__title">매물 등록</p>
                <div className="mobile-register-page__introduce">
                    <label>매물 소개</label>
                    <input 
                        placeholder="매물 소개를 입력해 주세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mobile-register-page__photo">
                    <div className="photo-header">
                        <label>사진 첨부</label>
                        <IoIosCamera
                            className="camera-icon"
                            size={40}
                            onClick={() => fileInputRef.current.click()}
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    {images.length > 0 ? (
                        <div className="image-preview-container">
                            <div className="image-preview-scroll">
                                {images.map((url, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={url} alt={`Preview ${index + 1}`} />
                                        <div
                                            className="delete-button"
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <IoMdClose size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-image-message">
                            사진을 첨부해주세요.
                        </div>
                    )}
                </div>
                <div className="mobile-register-page__deposit-rent">
                    <label>보증금 / 월세</label>
                    <div className="deposit-input">
                        <input 
                            placeholder="보증금"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            type="number"
                        />
                        <input 
                            placeholder="월세"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(e.target.value)}
                            type="number"
                        />
                    </div>
                </div>
                <div className="mobile-register-page__area">
                    <label>면적</label>
                    <input 
                        placeholder="00m²"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        type="number"
                    />
                </div>
                <div className="mobile-register-page__approve">
                    <label>사용승인일</label>
                    <input 
                        placeholder="YYYY-MM-DD"
                        value={approvalDate}
                        onChange={(e) => setApprovalDate(e.target.value)}
                        type="date"
                    />
                </div>
                <div className="mobile-register-page__floor">
                    <label>해당층 / 총층</label>
                    <div className="floor-input">
                        <input 
                            placeholder="해당층"
                            value={currentFloor}
                            onChange={(e) => setCurrentFloor(e.target.value)}
                            type="number"
                        />
                        <input 
                            placeholder="총층"
                            value={totalFloors}
                            onChange={(e) => setTotalFloors(e.target.value)}
                            type="number"
                        />
                    </div>
                </div>
                <div className="mobile-register-page__address">
                    <label>주소</label>
                    <div className="address-search-container">
                        <input 
                            placeholder="주소를 검색해 주세요."
                            value={addressKeyword}
                            onChange={(e) => setAddressKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                        />
                        <button onClick={searchAddress} disabled={isSearching}>
                            {isSearching ? '검색중...' : '검색'}
                        </button>
                    </div>
                    
                    {searchError && (
                        <div className="error-message">{searchError}</div>
                    )}

                    {showResults && addressResults.length > 0 && (
                        <div className="address-results">
                            {addressResults.map((result, index) => (
                                <div 
                                    key={index}
                                    className="address-item"
                                    onClick={() => handleAddressSelect(result)}
                                >
                                    <p className="road-address">{result.roadAddr}</p>
                                    <p className="jibun-address">[지번] {result.jibunAddr}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isSearching && !searchError && addressResults.length === 0 && addressKeyword && (
                        <div className="no-results" style={{ color: 'white' }}>
                            검색 결과가 없습니다.
                        </div>
                    )}

                    {address && (
                        <div className="selected-address">
                            선택된 주소: {address}
                        </div>
                    )}
                </div>
                <div className="mobile-register-page__option">
                    <div className="option-label" onClick={toggleOptions}>
                        <span>옵션</span>
                        <span>{optionsVisible ? '▲' : '▼'}</span>
                    </div>
                    {optionsVisible && (
                        <div className="options-container">
                            {optionsList.map((option) => (
                                <span
                                    key={option.optionId}
                                    className={`option-item ${selectedOptions.includes(option.optionId) ? 'selected' : ''}`}
                                    onClick={() => toggleOption(option.optionId)}
                                >
                                    {option.optionName}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="selected-options">
                        {selectedOptions
                            .map(id => optionsList.find(opt => opt.optionId === id)?.optionName)
                            .filter(Boolean)
                            .join(', ')}
                    </div>
                </div>
                <div className="submit-button">
                    <input 
                        type="submit" 
                        value="등록하기" 
                        onClick={handleSubmit}
                    />
                </div>
                <MobileBottomTab />
            </div>
        </div>
    );
}

export default MobileRegisterPage;