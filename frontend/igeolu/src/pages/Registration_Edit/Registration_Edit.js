import './Registration_Edit.css';
import { useState } from 'react'
// 등록 버튼 
import Registration_Button from '../../components/common/Registration_Button/Registration_Button';
// 뒤로가기 버튼
import BackButton from '../../components/common/Back_Button/Back_Button';

const Registration_Edit = () => {
    const [optionsVisible, setOptionsVisible] = useState(false);// 옵션을 접고 펴진 상태

    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태

    const [images, setImages] = useState([]); // 이미지 리스트 상태

    // 옵션 누르면 펴지고 접힘
    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    // 옵션 누르면 선택, 해제
    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option)); // 선택 해제
        } else {
            setSelectedOptions([...selectedOptions, option]); // 선택 추가
        }
    };

    // 브라우저의 뒤로가기 기능 호출
    const handleBack = () => {
        window.history.back();
    };

    // 이미지 추가 핸들러
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages([...images, ...imageUrls]);
    };

    // 버튼 누르면 수정 메시지 출력
    const edit_message = () => {
        alert("매물이 수정되었습니다!");
    };

    // 버튼 누르면 거래완료 메시지 출력
    const complete_message = () => {
        alert("매물이 거래완료되었습니다!");
    };


    // 옵션 리스트
    const optionsList = [
        '무인택배함', '에어컨', '침대', 'TV', '책상', '전자레인지', '샤워부스', '주차장',
        '세탁기', '옷장', '가스레인지', '현관보안', '냉장고', '건조기', '오븐',
        '엘리베이터', 'CCTV', '베란다', '인덕션'
    ];

    return (
        <div className="Registration">

            {/* 왼쪽 상단 뒤로가기 버튼 */}
            <BackButton onClick={handleBack} />

            <div>
                <h2>매물 등록</h2>
            </div>

            <div className= "Registration_input">
                <div className="Block">
                    <label>매물 소개</label>
                    <div className='Imagie_input'>
                        <textarea className="Introduction"></textarea>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                    </div>

                </div>

                <div className="Block">
                    <label>보증금/월세</label>
                    <div className = "S_input">
                        <input></input>
                        <input></input>
                    </div>
                </div>

                <div className="Block">
                    <label>전용면적</label>
                    <input></input>
                </div>

                <div className="Block">
                    <label>사용승인일</label>
                    <input></input>
                </div>

                <div className="Block">
                    <label>해당층/총층</label>
                    <div className = "S_input">
                        <input></input>
                        <input></input>
                    </div>
                </div>

                <div className="Block">
                    <label>도로명 주소</label>
                    <input></input>
                </div>

            </div>

            <div className="Registration_input">
                {/* 매물 등록 입력 필드 */}
                <div className="Block">
                    <label onClick={toggleOptions} className="toggle-label"> 옵션 {optionsVisible ? '▲' : '▼'}</label>
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

                {/* 매물 등록 버튼 */}
                <div className="ButtonContainer">
                    <Registration_Button onClick={edit_message}>수정</Registration_Button>
                    <Registration_Button onClick={complete_message}>거래완료</Registration_Button>
                </div>

            </div>

        </div>
    )
}

export default Registration_Edit