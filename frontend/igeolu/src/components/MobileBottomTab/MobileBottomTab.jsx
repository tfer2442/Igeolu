import { Link, useLocation } from 'react-router-dom';
import './MobileBottomTab.css'
import { AiFillHome } from 'react-icons/ai';
import { BsCalendarFill } from 'react-icons/bs';
import { BsChatFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';

function MobileBottomTab() {
    const location = useLocation();
    const isMainPage = location.pathname === '/mobile-main';
    const isCalendarPage = location.pathname === '/mobile-calendar';
    const isMyPage = location.pathname === '/mobile-my-page';

    return (
        <div className="mobile-bottom-tab">
            <Link to="/mobile-main" className="tab-item">
                <AiFillHome size={24} color={isMainPage ? "#01ADFF" : "white"} />
                <span >홈</span>
            </Link>
            <Link to="/mobile-calendar" className="tab-item">
                <BsCalendarFill size={24} color={isCalendarPage ? "#01ADFF" : "white"} />
                <span>캘린더</span>
            </Link>
            <div className="tab-item">
                <BsChatFill size={24} color="white" />
                <span>챗</span>
            </div>
            <Link to="/mobile-my-page" className="tab-item">
                <FaUserCircle size={24} color={isMyPage ? "#01ADFF" : "white"} />
                <span>프로필</span>
            </Link>
        </div>
    );
}

export default MobileBottomTab;