import React, { useState } from 'react';
import './DefaultPage.css';
import logo from '../../assets/images/메인로고.png';
import { useNavigate } from 'react-router-dom';
import snowflake from '../../assets/images/눈누끼.png';
import bearBefore from '../../assets/images/곰곰.png';
import penguinBefore from '../../assets/images/펭펭.png';
import bearAfter from '../../assets/images/곰웃.png';
import penguinAfter from '../../assets/images/펭웃.png';

function DefaultPage() {
    const navigate = useNavigate();
    const [isMobileHovered, setIsMobileHovered] = useState(false);
    const [isDesktopHovered, setIsDesktopHovered] = useState(false);

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
                    onMouseEnter={() => setIsMobileHovered(true)}
                    onMouseLeave={() => setIsMobileHovered(false)}
                    onTouchStart={() => setIsMobileHovered(true)}
                    onTouchEnd={() => setIsMobileHovered(false)}    
                >
                    <img 
                        src={isMobileHovered ? bearAfter : bearBefore} 
                        alt="bear" 
                        className="button-image"
                    />
                    <span className="default-page__button-text">공인중개사 페이지</span>
                </button>
                <button 
                    className="default-page__desktop-button" 
                    onClick={() => navigate('/desktop-main')}
                    onMouseEnter={() => setIsDesktopHovered(true)}
                    onMouseLeave={() => setIsDesktopHovered(false)}
                    onTouchStart={() => setIsDesktopHovered(true)}
                    onTouchEnd={() => setIsDesktopHovered(false)}
                >
                    <img 
                        src={isDesktopHovered ? penguinAfter : penguinBefore} 
                        alt="penguin" 
                        className="button-image"
                    />
                    <span className="default-page__button-text">고객 페이지</span>
                </button>
            </div>
        </div>
    );
}

export default DefaultPage;