import React from 'react';
import './DefaultPage.css';
import logo from '../../assets/images/모바일로고.png';
import { useNavigate } from 'react-router-dom';
import bear from '../../assets/images/곰누끼.png';
import penguin from '../../assets/images/펭귄누끼.png';
import snowflake from '../../assets/images/눈누끼.png';

function DefaultPage() {
    const navigate = useNavigate();

    return (
        <div className="default-page">
            {[...Array(30)].map((_, index) => (
                <div 
                    key={index} 
                    className="snowflake"
                    style={{
                        '--delay': `${Math.random() * 2}s`,
                        '--duration': `${Math.random() * 4 + 6}s`,
                        '--position': `${Math.random() * 100}%`,
                        '--top': `${Math.random() * -100}%`
                    }}
                >
                    <img src={snowflake} alt="snowflake" className="snowflake-img" />
                </div>
            ))}
            
            <div className="default-page__logo-container">
                <img src={logo} alt="logo" />
            </div>
            <div className="default-page__button-container">
                <button 
                    className="default-page__mobile-button"
                    onClick={() => navigate('/mobile-login')}
                >
                    <span className="default-page__button-text">공인중개사 페이지</span>
                </button>
                <button 
                    className="default-page__desktop-button" 
                    onClick={() => navigate('/desktop-main')}>
                    <span className="default-page__button-text">일반 페이지</span>
                </button>
            </div>
            <div className="default-page__footer">
                <img src={bear} alt="bear" />
                <img src={penguin} alt="penguin" />
            </div>
        </div>
    );
}

export default DefaultPage;
