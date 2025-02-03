import React from 'react';
import './SignUp.css';
// 등록 버튼 
import Registration_Button from '../../components/common/Registration_Button/Registration_Button';

const SignUp = () => {

    // 버튼 누르면 매물 등록 메시지 출력
    const handleRegister = () => {
        alert("회원가입이 완료되었습니다!");
    };

    return (
        <div className="SignupContainer">
            <div className="SignupBox">
                <h2>공인중개사 회원가입</h2>

                <input type="text" className="InputField" placeholder="전화번호" />
                <input type="text" className="InputField" placeholder="사업자 등록번호" />

                <Registration_Button onClick={handleRegister}>회원 가입</Registration_Button >
            </div>
        </div>
    );
};

export default SignUp;