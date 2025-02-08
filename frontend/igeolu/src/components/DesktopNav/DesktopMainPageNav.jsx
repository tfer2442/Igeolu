// src/components/DesktopNav/DesktopMainPageNav.jsx
import logo from '../../assets/images/logo.png'
import defaultProfile from '../../assets/images/defaultProfileImageIMSI.png'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './DesktopMainPageNav.css'

const NAV_ITEMS = [
    { id: 1, title: '방찾기', path: '/room' },
    { id: 2, title: '공인중개사', path: '/agent' },
    { id: 3, title: '라이브', path: '/make' },
]

function DesktopMainPageNav() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = 'https://i12d205.p.ssafy.io/api/logout';
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className='desktop-main-nav'>
      <div className='desktop-main-nav__left-logo'>
        <Link to='/'>
          <img src={logo} alt='logo' />
        </Link>
      </div>
      
      <div className='desktop-main-nav__middle-links'>
        {NAV_ITEMS.map((item) => (
          <Link to={item.path} key={item.id}>
            {item.title}
          </Link>
        ))}
      </div>
      
      <div className='desktop-main-nav__right-login'>
        {user ? (
          <div className="profile-container">
            <button className="profile-button" onClick={handleProfileClick}>
              <img src={defaultProfile} alt="profile" />
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/mypage" onClick={closeDropdown}>
                  마이페이지
                </Link>
                <button onClick={handleLogoutClick}>
                  로그아웃
                </button>
              </div>
            )}
            
            {isModalOpen && (
              <div className="logout-modal">
                <div className="logout-modal-content">
                  <h3>로그아웃 확인</h3>
                  <p>정말 로그아웃 하시겠습니까?</p>
                  <div className="modal-buttons">
                    <button onClick={handleLogoutConfirm}>예</button>
                    <button onClick={closeModal}>아니오</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className='desktop-main-nav__login-signin-btn'>
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}

export default DesktopMainPageNav;