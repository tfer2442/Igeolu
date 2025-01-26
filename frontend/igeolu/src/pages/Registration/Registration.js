import './Registration.css'
import { useState } from 'react'

const Registration = () => {
    // 옵션을 접고 펴진 상태
    const [optionsVisible, setOptionsVisible] = useState(false);

    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태

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

    const handleBack = () => {
        window.history.back(); // 브라우저의 뒤로가기 기능 호출
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
            <button className="BackButton" onClick={handleBack}>←</button>

            <div>
                <h2>매물 등록</h2>
            </div>

            <div className= "Registration_input">
                <div className="Block">
                    <label>매물 소개</label>
                    <input placeholder="매물 소개를 입력해 주세요."></input>
                </div>

                <div className="Block">
                    <label>보증금/월세</label>
                    <div className = "S_input">
                        <input placeholder="보증금"></input>
                        <input placeholder="월세"></input>
                    </div>
                </div>

                <div className="Block">
                    <label>전용면적</label>
                    <input placeholder="00m^2"></input>
                </div>

                <div className="Block">
                    <label>사용승인일</label>
                    <input placeholder="2100.01.01"></input>
                </div>

                <div className="Block">
                    <label>해당층/총층</label>
                    <div className = "S_input">
                        <input placeholder="해당층"></input>
                        <input placeholder="건물 총 층수"></input>
                    </div>
                </div>

                <div className="Block">
                    <label>도로명 주소</label>
                    <input placeholder="00도 00시 00로 00(00동, 0000)"></input>
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

                    <button className='Registration_Button'>매물 등록</button>
                </div>

            </div>

        </div>
    )
}

export default Registration