import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import './DesktopMainPageNav.css'

const NAV_ITEMS = [
    { id: 1, title: '방찾기', path: '/room' },
    { id: 2, title: '공인중개사', path: '/agent' },
    { id: 3, title: '라이브', path: '/make' },
]

function DesktopMainPageNav() {
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
      <Link to="/login" className='desktop-main-nav__login-signin-btn'>
          로그인
        </Link>
      </div>
    </nav>
  );
}

export default DesktopMainPageNav;