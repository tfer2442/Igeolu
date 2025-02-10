// import logo from '../../../assets/images/logo.png'
// import { Link } from 'react-router-dom'
// import './DesktopMapPageNav.css'
// import LocationSearch from '../LocationSearch/LocationSearch'

// const NAV_ITEMS = [
//     { id: 1, title: '방찾기', path: '/room' },
//     { id: 2, title: '공인중개사', path: '/agent' },
//     { id: 3, title: '라이브', path: '/live' },
// ]

// function DesktopMapPageNav({onLoginSigninClick}) {
//     return (
//         <nav className='desktop-map-nav'>
//             <div className='desktop-map-nav__left'>
//                 <Link to='/'>
//                     <img src={logo} alt='logo' />
//                 </Link>

//                 <LocationSearch></LocationSearch>

//             </div>
//             <div className='desktop-map-nav__right'>
//             <div className='desktop-map-nav__right-links'>
//                 {NAV_ITEMS.map((item) => (
//                     <Link to={item.path} key={item.id}>
//                         {item.title}
//                     </Link>
//                 ))}
//             </div>
//             <div className='desktop-map-nav__right-login'>
//                 <button onClick={onLoginSigninClick} className='desktop-live-and-my-nav__login-signin-btn'> 
//                     로그인 | 회원가입
//                 </button>
//             </div>
//             </div>
//         </nav>
//     )
// }

// export default DesktopMapPageNav;

import logo from '../../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import './DesktopMapPageNav.css'
import LocationSearch from '../LocationSearch/LocationSearch'

const NAV_ITEMS = [
    { id: 1, title: '방찾기', path: '/room' },
    { id: 2, title: '공인중개사', path: '/agent' },
    { id: 3, title: '라이브', path: '/live' },
]

function DesktopMapPageNav({ onLoginSigninClick, onSearchComplete, onSearchChange, searchKeyword }) {
    return (
        <nav className='desktop-map-nav'>
            <div className='desktop-map-nav__left'>
                <Link to='/'>
                    <img src={logo} alt='logo' />
                </Link>

                <LocationSearch 
                    onSearchComplete={onSearchComplete}
                    onSearchChange={onSearchChange}
                    searchKeyword={searchKeyword}
                />
            </div>
            <div className='desktop-map-nav__right'>
                <div className='desktop-map-nav__right-links'>
                    {NAV_ITEMS.map((item) => (
                        <Link to={item.path} key={item.id}>
                            {item.title}
                        </Link>
                    ))}
                </div>
                <div className='desktop-map-nav__right-login'>
                    <button onClick={onLoginSigninClick} className='desktop-map-nav__login-signin-btn'> 
                        로그인 | 회원가입
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default DesktopMapPageNav;