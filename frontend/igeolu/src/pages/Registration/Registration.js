
import './Registration.css';
import { useState } from 'react';
import axios from 'axios';

import Registration_Button from '../../components/common/Registration_Button/Registration_Button';
import BackButton from '../../components/common/Back_Button/Back_Button';
import AddressSearch from '../../components/common/AddressSearch/AddressSearch';

const Registration = () => {
    // 기존 상태들
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    // 입력 필드 상태들
    const [description, setDescription] = useState('');
    const [deposit, setDeposit] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [area, setArea] = useState('');
    const [approvalDate, setApprovalDate] = useState('');
    const [currentFloor, setCurrentFloor] = useState('');
    const [totalFloors, setTotalFloors] = useState('');
    
    // 주소 관련 상태
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [address, setAddress] = useState('');

    // 옵션 상태
    const toggleOptions = () => setOptionsVisible(!optionsVisible);

    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    // 뒤로가기 버튼
    const handleBack = () => {
        window.history.back();
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...imageUrls]);
        setImageFiles([...imageFiles, ...files]);
    };

    // 옵션 아이디 매핑
    const OPTIONS_MAP = {
        '침대': 1,
        '에어컨': 2,
        'TV': 3,
        '책상': 4,
        '옷장': 5,
        '주차장': 6,
        '전자렌지': 7,
        '샤워부스': 8,
        'CCTV': 9,
        '현관보안': 10,
        '냉장고': 11,
        '건조기': 12,
        '무인택배함': 13,
        '인덕션': 14,
        '가스레인지': 15,
        '베란다': 16,
        '오븐': 17,
        '세탁기': 18
    };

    const handleRegister = async () => {
        try {
            if (!selectedAddress) {
                alert('주소를 선택해주세요.');
                return;
            }
     
            if (!description || !deposit || !monthlyRent || !area || 
                !approvalDate || !currentFloor || !totalFloors) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
     
            const requestData = {
                userId: 12345,
                description,
                deposit: Number(deposit),
                monthlyRent: Number(monthlyRent),
                area: Number(area),
                approvalDate,
                currentFloor: Number(currentFloor),
                totalFloors: Number(totalFloors),
                address: selectedAddress.fullAddress,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
                dongCode: selectedAddress.dongCode,
                propertyOption: {
                    name: selectedOptions.map(option => OPTIONS_MAP[option])
                },
                images: images
            };

            const response = await axios.post('https://i12d205.p.ssafy.io/api/properties/', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ''
                }
            });
     
            if (response.status === 200) {
                alert("매물이 등록되었습니다!");
                // 폼 초기화
                setDescription('');
                setDeposit('');
                setMonthlyRent('');
                setArea('');
                setApprovalDate('');
                setCurrentFloor('');
                setTotalFloors('');
                setAddress('');
                setSelectedAddress(null);
                setSelectedOptions([]);
                setImages([]);
                setImageFiles([]);
            } else {
                throw new Error('매물 등록에 실패했습니다.');
            }
     
        } catch (error) {
            alert('매물 등록 중 오류가 발생했습니다.');
            console.error('Error:', error);
        }
    };

    
    // 테스트용!!!!!!!!
    // const handleRegister = async () => {
    //     try {
    //         if (!selectedAddress) {
    //             alert('주소를 선택해주세요.');
    //             return;
    //         }
     
    //         if (!description || !deposit || !monthlyRent || !area || 
    //             !approvalDate || !currentFloor || !totalFloors) {
    //             alert('필수 항목을 모두 입력해주세요.');
    //             return;
    //         }
     
    //         const requestData = {
    //             userId: 12345,
    //             description,
    //             deposit: Number(deposit),
    //             monthlyRent: Number(monthlyRent),
    //             area: Number(area),
    //             approvalDate,
    //             currentFloor: Number(currentFloor),
    //             totalFloors: Number(totalFloors),
    //             address: selectedAddress.fullAddress,
    //             latitude: selectedAddress.latitude,
    //             longitude: selectedAddress.longitude,
    //             dongCode: selectedAddress.dongCode,
    //             propertyOption: {
    //                 name: selectedOptions.map(option => OPTIONS_MAP[option])
    //             },
    //             images: images  // URL 배열 직접 전송
    //         };
     
    //         // API 호출 대신 콘솔에 출력
    //         console.log('매물 등록 요청 데이터:', requestData);
    //         console.log('이미지 URL 배열:', images);
    //         alert("매물 등록 테스트 완료!");
     
    //         // 폼 초기화
    //         setDescription('');
    //         setDeposit('');
    //         setMonthlyRent('');
    //         setArea('');
    //         setApprovalDate('');
    //         setCurrentFloor('');
    //         setTotalFloors('');
    //         setAddress('');
    //         setSelectedAddress(null);
    //         setSelectedOptions([]);
    //         setImages([]);
    //         setImageFiles([]);
     
    //     } catch (error) {
    //         alert('매물 등록 중 오류가 발생했습니다.');
    //         console.error('Error:', error);
    //     }
    // };

    const optionsList = [
        '침대', '에어컨', 'TV', '책상', '옷장', '주차장', 
        '전자렌지', '샤워부스', 'CCTV', '현관보안', '냉장고', 
        '건조기', '무인택배함', '인덕션', '가스레인지', '베란다', 
        '오븐', '세탁기'
    ];

    return (
        <div className="Registration">
            <BackButton onClick={handleBack} />
            <h2>매물 등록</h2>

            <div className="Registration_input">
                <div className="Block">
                    <label>매물 소개</label>
                    <div className='Imagie_input'>
                        <textarea 
                            className="Introduction" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="매물 소개를 입력해 주세요."
                        />
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>보증금/월세</label>
                    <div className="S_input">
                        <input 
                            type="number"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            placeholder="보증금"
                        />
                        <input 
                            type="number"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(e.target.value)}
                            placeholder="월세"
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>전용면적</label>
                    <input 
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="00m^2"
                    />
                </div>

                <div className="Block">
                    <label>사용승인일</label>
                    <input 
                        type="date"
                        value={approvalDate}
                        onChange={(e) => setApprovalDate(e.target.value)}
                    />
                </div>

                <div className="Block">
                    <label>해당층/총층</label>
                    <div className="S_input">
                        <input 
                            type="number"
                            value={currentFloor}
                            onChange={(e) => setCurrentFloor(e.target.value)}
                            placeholder="해당층"
                        />
                        <input 
                            type="number"
                            value={totalFloors}
                            onChange={(e) => setTotalFloors(e.target.value)}
                            placeholder="건물 총 층수"
                        />
                    </div>
                </div>

                <div className="Block">
                    <label>도로명 주소</label>
                    <AddressSearch 
                        onSelect={(address) => {
                            setSelectedAddress(address);
                            setAddress(address.fullAddress);
                        }} 
                    />
                    {selectedAddress && (
                        <input 
                            value={address}
                            readOnly
                            className="selected-address"
                        />
                    )}
                </div>
            </div>

            <div className="Registration_input">
                <div className="Block">
                    <label onClick={toggleOptions}>
                        옵션 {optionsVisible ? '▲' : '▼'}
                    </label>
                    {optionsVisible && (
                        <div className="Options">
                            {optionsList.map((option, index) => (
                                <span
                                    key={index}
                                    className={`Option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                                    onClick={() => toggleOption(option)}
                                >
                                    {option}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <Registration_Button onClick={handleRegister}>
                    매물 등록
                </Registration_Button>
            </div>
        </div>
    );
};

export default Registration;