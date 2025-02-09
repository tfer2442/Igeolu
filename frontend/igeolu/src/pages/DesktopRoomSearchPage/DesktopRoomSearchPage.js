import React from 'react';
import './DesktopRoomSearchPage.css';
import DesktopMainPageNav from '../../components/DesktopNav/DesktopLiveAndMyPage';
import WorldCup from '../../components/WorldCup/WorldCup';
import AddressSearch from '../../components/AddressSearch/AddressSearch';
const DesktopRoomSearchPage = () => {
    return (
        <div className='desktop-room-search-page'>
            <DesktopMainPageNav />
            <h1>DesktopRoomSearchPage</h1>
            <WorldCup />
            <AddressSearch />
        </div>
    );
};

export default DesktopRoomSearchPage;