// src/components/DesktopNav/DesktopLiveAndMyPage.jsx
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import './DesktopLiveAndMyPage.css'
import PropTypes from 'prop-types';

const NAV_ITEMS = [
    { id: 1, title: '방찾기', path: '/map?type=room' },
    { id: 2, title: '공인중개사', path: '/map?type=agent' },
    { id: 3, title: '라이브', path: '/live' },
]

function DesktopLiveAndMyPage({onLoginSigninClick}) {
    return (
        <nav className='desktop-live-and-my-nav'>
            <div className='desktop-live-and-my-nav__left-logo'>
                <Link to='/'>
                    <img src={logo} alt='logo' />
                </Link>
            </div>
            <div className='desktop-live-and-my-nav__right'>
            <div className='desktop-live-and-my-nav__right-links'>
                {NAV_ITEMS.map((item) => (
                    <Link to={item.path} key={item.id}>
                        {item.title}
                    </Link>
                ))}
            </div>
            <div className='desktop-live-and-my-nav__right-login'>
                <button onClick={onLoginSigninClick} className='desktop-live-and-my-nav__login-signin-btn'> 
                    로그인
                </button>
            </div>
            </div>
        </nav>
    )
}

DesktopLiveAndMyPage.propTypes = {
    onLoginSigninClick: PropTypes.func.isRequired,
  };

export default DesktopLiveAndMyPage;